const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db")
const User = require("./User.model")
const sequelize = database.sequelize

const UsedUserRefreshToken = sequelize.define("UsedUserrefreshToken", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    usedUserRefreshTokenValue: {
        type: DataTypes.STRING,
        allowNull: false
    },
    KeyUserId:{
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


module.exports = UsedUserRefreshToken