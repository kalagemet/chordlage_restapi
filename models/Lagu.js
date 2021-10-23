const { Sequelize } = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Lagu = db.define(
  "table_album",
  {
    judul: {
      type: DataTypes.STRING,
    },
    band: {
      type: DataTypes.INTEGER,
    },
    nama_band: {
      type: DataTypes.INTEGER,
    },
    abjad: {
      type: DataTypes.INTEGER,
    },
    created_by: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//export default Lagu;
module.exports = Lagu;