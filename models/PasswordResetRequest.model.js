const { DataTypes } = require("sequelize-cockroachdb");
const database = require("../dbs/db");
const User = require("./User.model");
const sequelize = database.sequelize;

const PasswordResetRequest = sequelize.define("PasswordResetRequest", {
    id: {
        type: DataTypes.UUID,
        default: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    UserId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: "id",
        },
    },
    otpCode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    otpExpireTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: () => {
            
            return new Date(Date.now() + 15 * 60 * 1000); 
        },
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
    },
},{
    freezeTableName:true,
    paranoid:true,
    timestamps:true
});

module.exports = PasswordResetRequest;
