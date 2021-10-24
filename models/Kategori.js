const { Sequelize } = require("sequelize");
const db = require("../config/database.js");

const { DataTypes } = Sequelize;

const Kategori = db.define(
	"table_rekomendasi",
	{
		id_lagu: {
			type: DataTypes.INTEGER,
		},
		judul: {
			type: DataTypes.STRING,
		},
		nama_band: {
			type: DataTypes.STRING,
		},
		flag: {
			type: DataTypes.STRING,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	}
);

module.exports = Kategori;
