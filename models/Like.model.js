const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const Comment = require("./Comment.model")
const User = require("./User.model")

const sequelize = database.sequelize

const Like = sequelize.define("Like",{
    CommentId:{
        type:DataTypes.INTEGER,
        references:{
            model:Comment,
            key:"id"
        }
    },
    UserId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    },
})

module.exports = Like