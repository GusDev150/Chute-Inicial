const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const Matricula = sequelize.define("Matricula", {
  unidade: { type: DataTypes.STRING, allowNull: false },
  categoria: { type: DataTypes.STRING },
});

Matricula.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE"
});
User.hasMany(Matricula, { foreignKey: "userId" });


module.exports = Matricula;