const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const Account = require("./Account.model")
const sequelize = database.sequelize

const UsedAdminRefreshToken = sequelize.define("UsedAdminRefreshToken", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    usedAdminRefreshTokenValue: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    AccountId:{
        type:DataTypes.INTEGER,
      
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