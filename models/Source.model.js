const { DataTypes, Model, Op } = require("sequelize-cockroachdb")
const {sequelize} = require("../dbs/db")
const slugify = require("slugify")
const Source = sequelize.define("Source", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
})

Source.addHook("beforeSave", (source) => {
    if (source.name) {
        source.slug = slugify(source.name, {
            lower: true, // Chuyển slug về chữ thường
            strict: true, // Loại bỏ các ký tự đặc biệt
            replacement: "-", // Thay thế khoảng trắng bằng dấu gạch ngang
        });
    }
});

module.exports = Source