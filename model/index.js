const dbConfig = require("../config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log("CONNECTED!!");
    })
    .catch((err) => {
        console.log("Error" + err);
    });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// REQUIRE ALL MODELS HERE
db.blogs = require("./blogModel.js")(sequelize, DataTypes)
db.User = require("./userModel")(sequelize, DataTypes);

//relationships
db.User.hasMany(db.blogs)
db.blogs.belongsTo(db.User)

db.sequelize.sync({ alter: false }).then(() => {
    console.log("yes re-sync done");
});

module.exports = db;