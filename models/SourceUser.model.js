const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const Source = require("./Source.model")
const User = require("./User.model")
const sequelize = database.sequelize

const SourceUser = sequelize.define("SourceUser",{
    UserId:{
        type:DataTypes.INTEGER,
        
        references:{
            model:User,
            key:"id"
        }
    },
    SourceId:{
        type:DataTypes.INTEGER,

        references:{
            model:Source,
            key:"id"
        }
    }
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})

module.exports = SourceUser