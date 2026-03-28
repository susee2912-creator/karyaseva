const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Application = sequelize.define("Application", {
  proposal: DataTypes.TEXT,

  status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
  },
});

module.exports = Application;