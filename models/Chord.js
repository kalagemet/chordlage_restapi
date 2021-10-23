const { Sequelize } = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Chord = db.define(
  "table_chord",
  {
    judul: {
      type: DataTypes.STRING,
    },
    band: {
      type: DataTypes.INTEGER,
    },
    nama_band: {
      type: DataTypes.STRING,
    },
    created_by: {
      type: DataTypes.STRING,
    },
    isi: {
      type: DataTypes.STRING,
    },
    abjad: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Chord;
//export default Chord;
