const jwt = require("jsonwebtoken")
const { asyncHandler } = require("../helpers/asyncHandler")
const { UnauthorizedError } = require("../cores/error.response")
const AccountService = require("../services/Account.service")
const KeyAdminService = require("../services/KeyAdmin.service")
const KeyUserService = require("../services/KeyUser.service")
const RolePermission = require("../models/RolePermission.model")
const Permission = require("../models/PermissionAdmin.model")
const HEADER = {
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: 'authorization',
    PRIVATEKEY: "x-private-key",
    REFRESHTOKEN: 'x-rtoken-id'
}
const createAccessToken = (payload, privateKey) => {
    return jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: '2h',
    })
}
const createRefreshToken = (payload, privateKey) => {
    return jwt.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn: '7d',
    })
}
const createTokenPair = async (payload, PublicKey, privateKey) => {
    try {
        const accessToken = createAccessToken(payload, privateKey)
        const refreshToken = createRefreshToken(payload, privateKey)
        jwt.verify(accessToken, PublicKey, (err, decode) => {
            if (err) {
                console.error("error verify::", err)
            } else {
                console.log("decode verify::", decode)
            }
        })
        return { accessToken, refreshToken }
    } catch (error) {
        console.error(error)
    }
}
const verifyJWT = async (token, keySecret) => {
    return jwt.verify(token, keySecret)
}
const authentication = asyncHandler(async (req, res, next) => {
    const authorization = req.headers[HEADER.AUTHORIZATION]
    let accessToken
    if (authorization) {
        accessToken = req.headers[HEADER.AUTHORIZATION].split(" ")[1]
    }
    const refreshtoken = req.headers[HEADER.REFRESHTOKEN]
    const privateKey = req.headers[HEADER.PRIVATEKEY]
    const clientId = req.headers[HEADER.CLIENT_ID]
    if (!clientId) {
        throw new UnauthorizedError("invalid request")
    }
    const keyAdmin = await KeyAdminService.findByAccountId(clientId)
    if (!keyAdmin) {
        throw new UnauthorizedError(" invalid request")
    }
    if (refreshtoken) {
        try {
            const { userId, roleId } = await verifyJWT(refreshtoken, keyAdmin.publicKey)
            if (userId != clientId) {
                throw new UnauthorizedError("Invalid request")
            } else {
                req.decode = { userId, roleId }
                req.refreshToken = refreshtoken
                req.privateKey = privateKey
                return next()
            }

        } catch (error) {
            throw error
        }
    }
    if (!accessToken) {
        throw new UnauthorizedError("Invalid request")
    }
    try {
        const { userId, roleId } = await verifyJWT(accessToken, keyAdmin.publicKey)

        if (!userId) {
            throw new UnauthorizedError("invalid user")
        }
        if (userId != clientId) {
            throw new UnauthorizedError("invalid request")
        } else {
            if (roleId) {
                const permissions = await RolePermission.findAll({
                    where: {
                        RoleId: roleId
                    },
                    include: {
                        model: Permission,
                        attributes: ['title']
                    }
                })
                req.permissions = permissions
            }
            req.decode = { userId, roleId }
            if (keyAdmin) {
                req.key = keyAdmin
            }
        }
        return next()
    } catch (error) {
        throw error
    }
})
module.exports = { createTokenPair, verifyJWT, createAccessToken, createRefreshToken, authentication }