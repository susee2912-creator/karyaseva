const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected");
  } catch (error) {
    console.error("DB Error:", error);
  }
};

module.exports = { sequelize, connectDB };