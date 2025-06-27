module.exports = {
    HOST: "localhost", // Database host  USER: "root",
    PORT: 3306, // Database port
    PASSWORD: "", // Database password
    USER: "root", // Database user
    DB: "BlogMaSystum", // DATABASE NAME
    dialect: "mysql", // Kun variation of sql use garney
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};