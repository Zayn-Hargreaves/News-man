const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const database = require("../dbs/db");
const Article = require("./Article.model");
const User = require("./User.model");

const sequelize = database.sequelize
class Comment extends Model{
    static associate(models) {
        this.hasMany(models.Comment, {
            as: "children",
            foreignKey: "ParentId",
        });
        this.belongsTo(models.Comment, {
            as: "parent",
            foreignKey: "ParentId",
        });
    }
}
Comment.init(
    {
        id: {
            type: DataTypes.UUID,
            default: DataTypes.UUIDV4,
            primaryKey: true
        },
        content:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        left:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        right:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        ArticleId:{
            type:DataTypes.UUID,
            default: DataTypes.UUIDV4,
            references:{
                model:Article,
                key:"id"
            }
        },
        UserId:{
            type:DataTypes.UUID,
            default: DataTypes.UUIDV4,
            references:{
                model:User,
                key:"id"
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



module.exports = Comment