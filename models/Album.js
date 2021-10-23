const { Sequelize } = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Album = db.define(
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

//export default Terbaru;
module.exports = Album;
