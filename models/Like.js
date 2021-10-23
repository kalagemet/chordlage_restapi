const { Sequelize } = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Like = db.define(
  "table_like",
  {
    id_user: {
      type: DataTypes.STRING,
    },
    id_chord: {
      type: DataTypes.INTEGER,
    },
    soft_delete: {
        type: DataTypes.INTEGER,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

//export default Like;
module.exports = Like;