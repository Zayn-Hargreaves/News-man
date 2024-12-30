const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db")
const Source = require("./Source.model")
const User = require("./User.model")
const sequelize = database.sequelize

const SourceUser = sequelize.define("SourceUser",{
    UserId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
        references:{
            model:User,
            key:"id"
        }
    },
    SourceId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
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