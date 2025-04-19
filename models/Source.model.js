const { DataTypes, Model, Op } = require("@sequelize/core")
const {sequelize} = require("../dbs/db")
const slugify = require("slugify")
const Source = sequelize.define("Source", {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        unique:true,
        validate: {
            isUrl: true
        }
    },
    avatar:{
        type:DataTypes.STRING(2048),
    },
    slug: {
        type: DataTypes.STRING,
        unique: true
    }
},{
    freezeTableName:true,
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