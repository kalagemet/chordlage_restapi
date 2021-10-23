const { Sequelize } = require("sequelize");

const db = new Sequelize("hamidmus_lagu", "hamidmus_root", "siangmalam", {
	host: "localhost",
	dialect: "mysql",
});

//export default db;
module.exports = db;
