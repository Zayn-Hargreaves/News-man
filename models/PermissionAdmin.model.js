const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const sequelize = database.sequelize

const Permission = sequelize.define("Permission", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    group: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true,
    tableName: 'Permission'
})


module.exports = Permission