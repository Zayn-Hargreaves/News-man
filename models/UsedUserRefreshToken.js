const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const User = require("./User.model")
const sequelize = database.sequelize

const UsedUserRefreshToken = sequelize.define("UsedUserrefreshToken", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    usedUserRefreshTokenValue: {
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


module.exports = UsedUserRefreshToken