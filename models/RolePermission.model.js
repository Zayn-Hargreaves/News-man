const { DataTypes, Model, Op } = require("@sequelize/core")
const database = require("../dbs/db")
const Role = require("./RoleAdmin.model")
const Permission = require("./PermissionAdmin.model")
const sequelize = database.sequelize

const RolePermission = sequelize.define("RolePermission",{
    RoleId:{
        type:DataTypes.INTEGER,
  
        references:{
            model:Role,
            key:"id"
        }
    },
    PermissionId:{
        type:DataTypes.INTEGER,
        references:{
            model:Permission,
            key:"id"
        }
    },
})

module.exports = RolePermission