const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const Source = require("./Source.model")
const sequelize = database.sequelize

const Selector = sequelize.define("Selector",{
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    selector:{
        type:DataTypes.STRING,
        allowNull:false
    },
    value:{
        type:DataTypes.TEXT
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

module.exports = Selector