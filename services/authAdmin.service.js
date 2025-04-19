const { createTokenPair, verifyJWT, createAccessToken } = require("../auth/authUtils");
const { NotFoundError, UnauthorizedError, ForbiddenError, ConflictError } = require("../cores/error.response");
const AccountService = require("./Account.service")
const bcrypt = require("bcrypt");
const { getInfoData } = require("../utils");
const UsedAdminRefreshTokenService = require("./UsedAdminRefreshToken.service");
const UserService = require("./User.service");
const User = require("../models/User.model");
const RolePermission = require("../models/RolePermission.model");
const Permission = require("../models/PermissionAdmin.model");
const KeyAdmin = require("../models/KeyAdmin.model");
const crypto = require("crypto");
const KeyAdminService = require("./KeyAdmin.service");
class AuthAdminService {
    static async signin({ name, email, password }) {
        const holderAccount = await UserService.findByEmail(email)
        if (holderAccount) {
            throw new ConflictError("Email is already registered")
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: passwordHash,
            status: 'active'
        })
        if (newUser) {
            const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem',
                },
            });
            const userId = newUser.id
            const tokens = await createTokenPair(
                { userId},
                publicKey,
                privateKey
            )
            await this.keyService.createToken({
                userId,
                publicKey,
                refreshToken: tokens.resfreshToken
            })
            return {
                code:201,
                metadata:{
                    user:getInfoData({
                        fields:["id", 'name','email'],
                        object:newUser  
                    }),
                    tokens:tokens
                }
            }
        }
    }
    static async login({ email, password, resfreshToken = null }) {
        const account = await AccountService.findByEmail({ email });
        if (!account) {
            throw new NotFoundError("Account not found")
        }
        const match = await bcrypt.compare(password, account.password)
        if (!match) {
            throw new UnauthorizedError("Invalid email or password")
        }
        if (account.status !== "active") {
            throw new UnauthorizedError("Account inactive")
        }
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });
        const { id: userId, RoleId: roleId } = account
        const keyadmin = await KeyAdminService.findByAccountId(userId)
        if (keyadmin) {
            await UsedAdminRefreshTokenService.InsertUsedRefreshToken(userId, keyadmin.refreshToken)
            await KeyAdminService.deleteByAccountId(userId)
        }
        if (roleId) {
            const tokens = await createTokenPair(
                { userId, roleId },
                publicKey,
                privateKey
            )
            await KeyAdminService.createToken({
                AccountId:userId,
                publicKey,
                refreshToken: tokens.refreshToken
            })
            const permissions = await RolePermission.findAll({
                attributes: [],
                where: { RoleId: roleId },
                include: {
                    model: Permission,
                    attributes: ['title', 'group'],
                },
                raw: true,
            }); 
            const permissionTitle = [];
            const groupSet = new Set();
            
            permissions.forEach(permission => {
                permissionTitle.push(permission["permission.title"]);
                groupSet.add(permission["permission.group"]);
            });
            
            const uniquePermissionGroup = Array.from(groupSet);
            
            return {
                account: getInfoData({
                    fields: ["id", "name", "email", "CategoryId","RoleId", "avatar"],
                    object: account
                }),
                permissions: permissionTitle,
                group:uniquePermissionGroup,
                tokens,
                privateKey
            }
        } 
    }

    static async logout({ refreshToken }) {
        const key = await KeyAdminService.findByToken(refreshToken)
        const delKey = await KeyAdminService.deleteByToken(refreshToken)
        await UsedAdminRefreshTokenService.InsertUsedRefreshToken(key.AccountId, refreshToken)
        return delKey
    }

    static async handleRefreshTokenAdmin({ refreshToken, privateKey, decode }) {
        if (await UsedAdminRefreshTokenService.FindToken(refreshToken)) {
            await KeyAdminService.deleteByAccountId(decode.userId)
            throw new ForbiddenError("Something wrong happend ! Please relogin")
        }
        const KeyAdmin = await KeyAdminService.findByAccountId(decode.userId)
        if (KeyAdmin.refreshToken != refreshToken) {
            throw new UnauthorizedError("Error: Account is not created")
        }
        if (await AccountService.findByAccountId(decode.userId)) {
            throw new UnauthorizedError("Error: Account is not created")
        }
        let formattedPrivateKey = privateKey.replace(/\\n/g, "\n").replace(/"/g, '');

        const accessToken = createAccessToken(decode, formattedPrivateKey);
        return {
            accessToken,
            refreshToken,
        }
    }

}


module.exports = AuthAdminService;