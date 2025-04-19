const { DataTypes, Model } = require("@sequelize/core");
const database = require("../dbs/db");
const sequelize = database.sequelize;

const Article = require("./Article.model");
const User = require("./User.model");

class   Comment extends Model {
    static associate(models) {
        this.hasMany(models.Comment, {
            as: "children",  // Tên alias cho mối quan hệ 'hasMany'
            foreignKey: "ParentId",
        });
        this.belongsTo(models.Comment, {
            as: "parent",  // Tên alias cho mối quan hệ 'belongsTo'
            foreignKey: "ParentId",
        });
    }
}

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        left: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        right: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        isReported: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        ArticleId: {
            type: DataTypes.INTEGER,
            references: {
                model: Article,
                key: "id"
            }
        },
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: "id"
            }
        },
    },
    {
        sequelize,
        modelName: "Comment",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    }
);

module.exports = Comment;
