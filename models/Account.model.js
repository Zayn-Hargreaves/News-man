const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const Role = require("./Role.model");
const Category = require("./Category.model");
const database = require("../dbs/db");
const sequelize = database.sequelize
const Account = sequelize.define("Account", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
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
    Status:{
        type:DataTypes.STRING,
    },
    CategoryId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
        references:{
            model:Category,
            key:"id"
        }
    },
    RoleId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
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