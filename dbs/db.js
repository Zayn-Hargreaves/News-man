const { Sequelize } = require("sequelize-cockroachdb");
const { db: { cockroachUrl } } = require("../config/config.database");

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'postgres') {
        this.sequelize = new Sequelize(cockroachUrl, {
            logging: (msg) => { console.log(`[DB]:::${msg}`); },
            pool: {
                max: 50,
                min: 0,
                acquire: 30000,
                idle: 1000
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
