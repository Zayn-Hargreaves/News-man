const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const sequelize = database.sequelize

const Role = sequelize.define("Role", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})


module.exports = Role