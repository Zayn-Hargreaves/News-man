const { DataTypes, Model } = require("sequelize-cockroachdb");
const database = require("../dbs/db");
const sequelize = database.sequelize;

class Category extends Model {
    static associate(models) {
        this.hasMany(models.Category, {
            as: "children",
            foreignKey: "ParentId",
        });
        this.belongsTo(models.Category, {
            as: "parent",
            foreignKey: "ParentId",
        });
    }
}

Category.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
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
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Category",
        freezeTableName: true,
        paranoid: true,
        timestamps: true,
    }
);

module.exports = Category;
