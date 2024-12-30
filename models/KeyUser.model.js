const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const Role = require("./Role.model");
const Category = require("./Category.model");
const database = require("../dbs/db");
const Account = require("./Account.model");
const User = require("./User.model");
const sequelize = database.sequelize
const KeyUser = sequelize.define("KeyUser", {
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
    UserId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
        references:{
            model:User,
            key:"id"
        }
    },
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})

module.exports = KeyUser