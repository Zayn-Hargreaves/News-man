const Source = require("../models/Source.model");
const Selector = require("../models/Selector.model");
const Article = require("../models/Article.model");
const Category = require("../models/Category.model");
const Comment = require("../models/Comment.model");
const User = require("../models/User.model");
const Role = require("../models/RoleAdmin.model");
const RolePermission = require("../models/RolePermission.model");
const Permission = require("../models/PermissionAdmin.model");
const Account = require("../models/Account.model");
const Notification = require("../models/Notification.model");
const KeyAdmin = require("../models/KeyAdmin.model");
const UsedAdminRefreshToken = require("../models/UsedAdminRefreshToken");
const KeyUser = require("../models/KeyUser.model");
const PasswordResetRequest = require("../models/PasswordResetRequest.model");
const UsedUserRefreshToken = require("../models/UsedUserRefreshToken");
const Like = require("../models/Like.model");
const Dislike = require("../models/Dislike.model");
const SourceUser = require("../models/SourceUser.model");
const database = require("../dbs/db");

const sequelize = database.sequelize;

const association = async () => {
    try {
        await sequelize.authenticate();

        // Tạo mối quan hệ giữa Source và các mô hình khác
        Source.hasMany(Selector, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });
        Selector.belongsTo(Source, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });

        Source.hasMany(Article, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });
        Article.belongsTo(Source, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });

        Source.hasMany(Notification, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });
        Notification.belongsTo(Source, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });

        Source.hasMany(SourceUser, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });
        SourceUser.belongsTo(Source, {
            foreignKey: {
                name: 'SourceId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });

        // Tạo mối quan hệ giữa Article và Comment
        Article.hasMany(Comment, {
            foreignKey: {
                name: 'ArticleId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });
        Comment.belongsTo(Article, {
            foreignKey: {
                name: 'ArticleId',
                onDelete: 'CASCADE'  // Xóa các bản ghi con khi bản ghi cha bị xóa
            }
        });

        // Tạo mối quan hệ giữa Category và chính nó
        Category.hasMany(Category, {
            as: "children",
            foreignKey: {
                name: "ParentId",
                onDelete: "CASCADE"
            },
            inverse: { as: "parent" }  // Thêm phần inverse.as
        });
        Category.belongsTo(Category, {
            as: "parent",
            foreignKey: {
                name: "ParentId",
                onDelete: 'CASCADE'
            }
        });

        // Tạo mối quan hệ giữa Category và các mô hình khác
        Category.hasMany(Account, { foreignKey: "CategoryId" });
        Account.belongsTo(Category, { foreignKey: "CategoryId" });

        Category.hasMany(Article, { foreignKey:{name: "CategoryId", onDelete:"CASCADE" }});
        Article.belongsTo(Category, { foreignKey:{name:"CategoryId", onDelete:"CASCADE"} });

        // Tạo mối quan hệ giữa Comment và chính nó
        Comment.hasMany(Comment, { as: 'children', foreignKey:{name: 'ParentId', onDelete:'CASCADE'}, inverse: { as: "parent" } });
        Comment.belongsTo(Comment, { as: 'parent', foreignKey:{name: 'ParentId' ,onDelete:'CASCADE'}});

        // Quan hệ giữa Comment và Like, Dislike
        Comment.hasMany(Like, { foreignKey:{name:"CommentId", onDelete:"CASCADE"}});
        Like.belongsTo(Comment, { foreignKey:{name:"CommentId", onDelete:"CASCADE"} });

        Comment.hasMany(Dislike, { foreignKey: {name:"CommentId", onDelete:"CASCADE"}});
        Dislike.belongsTo(Comment, { foreignKey:{name:"CommentId", onDelete:"CASCADE"} });

        // Quan hệ giữa Account và Role
        Role.hasMany(Account, { foreignKey: "RoleId" });
        Account.belongsTo(Role, { foreignKey: 'RoleId' });

        // Quan hệ giữa Role và Permission
        Role.hasMany(RolePermission, { foreignKey: "RoleId" });
        RolePermission.belongsTo(Role, { foreignKey: "RoleId" });

        Permission.hasMany(RolePermission, { foreignKey: "PermissionId" });
        RolePermission.belongsTo(Permission, { foreignKey: "PermissionId" });

        // Quan hệ giữa User và các mô hình khác
        User.hasMany(SourceUser, { foreignKey: "UserId" });
        SourceUser.belongsTo(User, { foreignKey: "UserId" });

        User.hasMany(Comment, { foreignKey: "UserId" });
        Comment.belongsTo(User, { foreignKey: "UserId" });

        User.hasMany(Notification, { foreignKey: "UserId" });
        Notification.belongsTo(User, { foreignKey: "UserId" });

        // Quan hệ giữa Account và các mô hình admin
        Account.hasMany(KeyAdmin, { foreignKey: "AccountId" });
        KeyAdmin.belongsTo(Account, { foreignKey: "AccountId" });

        Account.hasMany(UsedAdminRefreshToken, { foreignKey: "AccountId" });
        UsedAdminRefreshToken.belongsTo(Account, { foreignKey: "AccountId" });

        User.hasMany(KeyUser, { foreignKey: "UserId" });
        KeyUser.belongsTo(User, { foreignKey: "UserId" });

        User.hasMany(UsedUserRefreshToken, { foreignKey: "UserId" });
        UsedUserRefreshToken.belongsTo(User, { foreignKey: "UserId" });

        User.hasMany(PasswordResetRequest, { foreignKey: "UserId" });
        PasswordResetRequest.belongsTo(User, { foreignKey: "UserId" });

        await sequelize.sync();

    } catch (error) {
        console.error("Association error:::", error);
    }
};

module.exports = association;
