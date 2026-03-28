const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Milestone = sequelize.define("Milestone", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "released"),
    defaultValue: "pending",
  },
});

module.exports = Milestone;
