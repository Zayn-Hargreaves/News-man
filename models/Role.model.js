const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db")
const sequelize = database.sequelize

const Role = sequelize.define("Role", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})


module.exports = Role