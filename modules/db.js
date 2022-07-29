require("dotenv").config();
const mysql = require("mysql");

let dbConnection;

module.exports = {
    connect: async function() {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_DATABASE,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        })
        
        const connectionPromise = new Promise(async (resolve, reject) => {

            connection.connect(function(err) {
                if(err) reject(err);
                console.log("[DB] ~ Connected!")
                resolve(connection)
            });

        })

        await connectionPromise;

        return connection;
    },

    initialize: async function() {

        dbConnection = await this.connect();

    },

    query: async function(query, arguments=[]) {
        // const connection = conn || await this.connect();
        let res = {};
        
        if(!dbConnection) await this.initialize();

        const queryPromise = new Promise(async (resolve, reject) => {

            // console.log(`[DB] ~ Executing query ${query} with arguments ${arguments}`)
            await dbConnection.query(query, arguments, function(err, result) {
                if(err) reject(err);

                res = result;
                resolve(result);
            })
        })

        await queryPromise;
        // console.log(`[DB] ~ Query ${query} with arguments ${arguments} returned results:\n${JSON.stringify(res)}`)
        return res;

    }
}