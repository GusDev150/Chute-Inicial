const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const LoginLog = sequelize.define("LoginLog", {
  loginAt: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW,
    get() {
      const rawValue = this.getDataValue("loginAt");
      if (!rawValue) return null;
      return rawValue.toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: User, key: "id" },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
});

// Relacionamentos
LoginLog.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});
User.hasMany(LoginLog, { foreignKey: "userId" });


module.exports = LoginLog;
