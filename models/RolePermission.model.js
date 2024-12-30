const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db")
const Role = require("./Role.model")
const Permission = require("./Permission.model")
const sequelize = database.sequelize

const RolePermission = sequelize.define("RolePermission",{
    RoleId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
        references:{
            model:Role,
            key:"id"
        }
    },
    PermissionId:{
        type:DataTypes.UUID,
        default: DataTypes.UUIDV4,
        references:{
            model:Permission,
            key:"id"
        }
    },
})

module.exports = RolePermission