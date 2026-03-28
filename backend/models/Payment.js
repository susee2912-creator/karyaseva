const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Payment = sequelize.define("Payment", {
  amount: DataTypes.INTEGER,

  status: {
    type: DataTypes.STRING,
    defaultValue: "deposited",
  },
});

module.exports = Payment;