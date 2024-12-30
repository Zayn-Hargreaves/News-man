const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db")
const Source = require("./Source.model")
const sequelize = database.sequelize

const Selector = sequelize.define("Selector",{
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    selector:{
        type:DataTypes.STRING,
        allowNull:false
    },
    value:{
        type:DataTypes.TEXT
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

module.exports = Selector