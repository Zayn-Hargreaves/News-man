const { DataTypes, Model } = require("@sequelize/core");
const database = require("../dbs/db");
const sequelize = database.sequelize;
const slugify = require("slugify")
class Category extends Model {
    static associate(models) {
        this.hasMany(models.Category, {
            as: "children",  // Tên alias cho mối quan hệ 'hasMany'
            foreignKey: "ParentId",
        });
        this.belongsTo(models.Category, {
            as: "parent",  // Tên alias cho mối quan hệ 'belongsTo'
            foreignKey: "ParentId",
        });
    }
}

Category.init(
    {
        id: {
            type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Category",
        tableName:"Category",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    }
);

Category.addHook("beforeSave", (category) => {
    if (category.title) {
        category.slug = slugify(category.title, {
            lower: true, // Chuyển slug về chữ thường
            strict: true, // Loại bỏ các ký tự đặc biệt
            replacement: "-", // Thay thế khoảng trắng bằng dấu gạch ngang
        });
    }
});
module.exports = Category;
