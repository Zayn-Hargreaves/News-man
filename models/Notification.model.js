const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db");
const User = require("./User.model");
const Source = require("./Source.model");

const sequelize = database.sequelize
const Notification = sequelize.define("Notification", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    message:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    isRead:{
        type:DataTypes.BOOLEAN,
    },
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

module.exports = Notification