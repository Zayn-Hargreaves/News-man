const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db")
const Account = require("./Account.model")
const sequelize = database.sequelize

const UsedAdminRefreshToken = sequelize.define("UsedAdminRefreshToken", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    usedAdminRefreshTokenValue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    KeyAdminId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
        references:{
            model:Account,
            key:"id"
        }
    },
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})


module.exports = UsedAdminRefreshToken