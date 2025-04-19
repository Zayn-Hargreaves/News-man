const { Sequelize } = require("@sequelize/core");
const { db: { dbUrl } } = require("../config/config.database");

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'postgres') {
        this.sequelize = new Sequelize({
            dialect: 'postgres',
            url: dbUrl,
            logging: (msg) => { console.log(`[DB]:::${msg}`); },
            pool: {
                max: 50,
                min: 0,
                acquire: 30000,
                idle: 1000
            },
            ssl: {
                require: true, // Bắt buộc SSL
                rejectUnauthorized: false // Có thể không kiểm tra chứng chỉ SSL (điều này có thể thay đổi tùy vào yêu cầu bảo mật của dịch vụ)
            }
        });

        this.sequelize.authenticate()
            .then(() => {
                console.log("Connected to database successfully");
            })
            .catch((err) => {
                console.log("Error Database Connection", err);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceDatabase = Database.getInstance();
module.exports = instanceDatabase;
