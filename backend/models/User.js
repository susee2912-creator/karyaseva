const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING, allowNull: false },

  email: { type: DataTypes.STRING, unique: true },

  password: { type: DataTypes.STRING },

  role: {
    type: DataTypes.ENUM("client", "freelancer"),
  },

  trustScore: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
  },

  completedJobs: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },

  idDocument: {
    type: DataTypes.STRING,
  },
});

module.exports = User;