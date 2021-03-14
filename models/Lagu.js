import { Sequelize } from "sequelize";
import db from "../config/database.js";

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
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Lagu;
