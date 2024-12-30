const Article = require("../models/Article.model");
const Selector = require("../models/Selector.model");
const Source = require("../models/Source.model");
const SourceUser = require("../models/SourceUser.model");
const Comment = require("..//models/Comment.model");
const Category = require("../models/Category.model");
const Account = require("../models/Account.model");
const Role = require("../models/Role.model");
const RolePermission = require("../models/RolePermission.model");
const Permission = require("../models/Permission.model");
const User = require("../models/User.model");
const Notification = require("../models/Notification.model")
const database = require("../dbs/db");
const KeyAdmin = require("../models/KeyAdmin.model");
const UsedAdminRefreshToken = require("../models/UsedAdminRefreshToken");
const KeyUser = require("../models/KeyUser.model");
const PasswordResetRequest = require("../models/PasswordResetRequest.model");
const UsedUserRefreshToken = require("../models/UsedUserRefreshToken");
const sequelize = database.sequelize
const association = async() => {
    try {
        await sequelize.authenticate()
        Source.hasMany(Selector, { foreignKey: 'SourceId' })
        Selector.belongsTo(Source, { foreignKey: 'SourceId' })
    
        Source.hasMany(Article, { foreignKey: 'SourceId' })
        Article.belongsTo(Source, { foreignKey: 'SourceId' })

        Source.hasMany(Notification, { foreignKey: 'SourceId' })
        Notification.belongsTo(Source, { foreignKey: "SourceId" })

        Source.hasMany(SourceUser, { foreignKey: "SourceId" })
        SourceUser.belongsTo(Source, { foreignKey: "SourceId" })

        Article.hasMany(Comment, { foreignKey: "ArticleId" })
        Comment.belongsTo(Article, { foreignKey: "ArticelId" })

        Category.hasMany(Category, { as: 'children', foreignKey: "ParentId" })
        Category.belongsTo(Category, { as: 'parent', foreignKey: "ParentId" })

        Category.hasMany(Account, { foreignKey: "CategoryId" })
        Account.belongsTo(Category, { foreignKey: "CategoryId" })

        Category.hasMany(Article, { foreignKey: "CategoryId" })
        Article.belongsTo(Category, { foreignKey: "CategoryId" })

        Comment.hasMany(Comment, { as: 'children', foreignKey: "ParentId" })
        Comment.belongsTo(Comment, { as: 'parent', foreignKey: "ParentId" })

        Role.hasMany(Account, { foreignKey: "RoleId" })
        Account.belongsTo(Role, { foreignKey: 'RoleId' })

        Role.hasMany(RolePermission, { foreignKey: "RoleId" })
        RolePermission.belongsTo(Role, { foreignKey: "RoleId" })

        Permission.hasMany(RolePermission, { foreignKey: "PermissionId" })
        RolePermission.belongsTo(Permission, { foreignKey: "PermissionId" })

        User.hasMany(SourceUser, { foreignKey: "UserId" })
        SourceUser.belongsTo(User, { foreignKey: "UserId" })

        User.hasMany(Comment, { foreignKey: "UserId" })
        Comment.belongsTo(User, { foreignKey: "UserId" })

        User.hasMany(Notification, { foreignKey: "UserId" })
        Notification.belongsTo(User, { foreignKey: "UserId" })

        Account.hasMany(KeyAdmin,{foreignKey:"AccountId"})
        KeyAdmin.belongsTo(Account,{foreignKey:"AccountId"})

        KeyAdmin.hasMany(UsedAdminRefreshToken,{foreignKey:"KeyAdminId"})
        UsedAdminRefreshToken.belongsTo(KeyAdmin,{foreignKey:"KeyAdminId"})

        User.hasMany(KeyUser,{foreignKey:"UserId"})
        KeyAdmin.belongsTo(Account,{foreignKey:"UserId"})

        KeyUser.hasMany(UsedUserRefreshToken,{foreignKey:"KeyUserId"})
        UsedUserRefreshToken.belongsTo(KeyUser,{foreignKey:"KeyUserId"})

        User.hasMany(PasswordResetRequest,{foreignKey:"UserId"})
        PasswordResetRequest.belongsTo(User,{foreignKey:"UserId"})
        await sequelize.sync();
    } catch (error) {
        console.error("association error:::",error)
    }
}
module.exports = association
