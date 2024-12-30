const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db");
const Account = require("./Account.model");
const sequelize = database.sequelize
const KeyAdmin = sequelize.define("KeyAdmin", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    publicKey:{
        type: DataTypes.STRING,
        allowNull: false
    },
    refreshToken:{
        type: DataTypes.STRING,
        allowNull: false
    },
    AccountId:{
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

module.exports = KeyAdmin