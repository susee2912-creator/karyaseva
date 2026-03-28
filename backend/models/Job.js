const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Job = sequelize.define("Job", {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  budget: DataTypes.INTEGER,

  status: {
    type: DataTypes.STRING,
    defaultValue: "open",
  },

  riskLevel: {
    type: DataTypes.STRING,
    defaultValue: "Low",
  },

  workProofHash: {
    type: DataTypes.STRING,
  },

  freelancerId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

module.exports = Job;