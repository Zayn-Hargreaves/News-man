const { DataTypes, Model, Op } = require("@sequelize/core")
const Role = require("./RoleAdmin.model");
const Category = require("./Category.model");
const database = require("../dbs/db");
const Account = require("./Account.model");
const User = require("./User.model");
const sequelize = database.sequelize
const KeyUser = sequelize.define("KeyUser", {
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
    UserId:{
        type:DataTypes.INTEGER,
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