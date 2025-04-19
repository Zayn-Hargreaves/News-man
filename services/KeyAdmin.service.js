const KeyAdmin = require("../models/KeyAdmin.model")
const {where} = require("@sequelize/core")
class KeyAdminService {
    static createToken = async ({ AccountId, publicKey, refreshToken }) => {
        try {
            const token= await KeyAdmin.create({
                AccountId,
                publicKey,
                refreshToken
            }, {
                where: { AccountId },
                return: true
            })
            return token ? token.publicKey : null
        } catch (error) {
            console.error(error)
        }
    }
    static findByToken = async (token) => {
        return await KeyAdmin.findOne({
            where: {
                refreshToken: token
            },
            raw: true
        })
    }
    static findByAccountId = async (AccountId) => {
        return await KeyAdmin.findOne({
            where: {
                AccountId: (AccountId)
            },
            raw: true
        })
    }
    static deleteByToken = async (token) => {
        return await KeyAdmin.destroy({
            where: {
                refreshToken: token
            }
        })
    }
    static deleteByAccountId = async (AccountId) => {
        return await KeyAdmin.destroy({
            where: {
                AccountId: AccountId
            }
        })
    }
}

module.exports = KeyAdminService