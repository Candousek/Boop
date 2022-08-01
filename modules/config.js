const database = require("./db");

module.exports = {
    get: async function(key) {
        const result = (await database.query("SELECT * FROM config WHERE configkey=?", [key]))[0];
        return result?.configvalue;
    },
    set: async function(key, value) {
        await database.query("INSERT INTO config (configkey, configvalue) VALUES (?, ?) ON DUPLICATE KEY UPDATE configvalue = ?", [key, value, value]);
        return true;
    },
    delete: async function(key) {
        await database.query("DELETE FROM config WHERE configkey = ?", [key]);
        return true;
    },
    getAll: async function() {
        const result = await database.query(`SELECT * FROM config`);
        return result;
    }
}