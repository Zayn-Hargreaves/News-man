const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const {sequelize} = require("../dbs/db")
const User = sequelize.define("User", {
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
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar:{
        type:DataTypes.STRING(2048),
    }
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})

module.exports = User