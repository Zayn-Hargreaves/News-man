const { DataTypes, Model, Op } = require("@sequelize/core")
const Role = require("./RoleAdmin.model");
const Category = require("./Category.model");
const database = require("../dbs/db");
const sequelize = database.sequelize
const Account = sequelize.define("Account", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status:{
        type:DataTypes.STRING,
    },
    avatar:{
        type:DataTypes.STRING(2048),
    },
    CategoryId:{
        type:DataTypes.INTEGER,
        references:{
            model:Category,
            key:"id"
        }
    },
    RoleId:{
        type:DataTypes.INTEGER,
        references:{
            model:Role,
            key:"id"
        }
    }
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})

module.exports = Account