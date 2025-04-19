const { DataTypes, Model, Op } = require("@sequelize/core")
const {sequelize} = require("../dbs/db")
const Source = require("./Source.model")
const Category = require("./Category.model")
const Article = sequelize.define("Article", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    thumbnail:{
        type:DataTypes.TEXT,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description:{
        type:DataTypes.TEXT
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    SourceId:{
        type:DataTypes.INTEGER,    
        references:{
            model:Source,
            key:"id"
        }
    },
    CategoryId:{
        type:DataTypes.INTEGER,
        references:{
            model:Category,
            key:"id"
        }
    }
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})

Article.addHook("beforeSave", (article) => {
    if (article.title) {
        article.slug = slugify(article.title, {
            lower: true, // Chuyển slug về chữ thường
            strict: true, // Loại bỏ các ký tự đặc biệt
            replacement: "-", // Thay thế khoảng trắng bằng dấu gạch ngang
        });
    }
});

module.exports = Article