import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Terbaru = db.define(
  "table_album",
  {
    judul: {
      type: DataTypes.STRING,
    },
    nama_band: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

export default Terbaru;
