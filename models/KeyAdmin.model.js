const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db");
const Account = require("./Account.model");
const sequelize = database.sequelize
const KeyAdmin = sequelize.define("KeyAdmin", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    publicKey:{
        type: DataTypes.TEXT,
        allowNull: false
    },
    refreshToken:{
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
    timestamps:true
})

module.exports = KeyAdmin