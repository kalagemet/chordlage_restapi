const { Sequelize } = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Band = db.define(
  "table_band",
  {
    nama: {
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

// export default band
module.exports = Band;