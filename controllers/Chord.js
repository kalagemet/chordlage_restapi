const Chord = require("../models/Chord.js");
const Band = require("../models/Band.js");
const Lagu = require("../models/Lagu.js");
const Like = require("../models/Like.js");
const Album = require("../models/Album.js");
const Kategori = require("../models/Kategori.js");
const { Sequelize } = require("sequelize");
const e = require("express");

const Op = Sequelize.Op;

const getPagination = (page, size) => {
	const limit = size ? +size : 3;
	const offset = page ? page * limit : 0;

	return { limit, offset };
};

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: row } = data;
	const currentPage = page ? +page : 0;
	const totalPages = Math.ceil(totalItems / limit);

	return { totalItems, row, totalPages, currentPage };
};

// get
exports.getChord = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { id, user_id } = req.body.payload;
		if (!id || !user_id) res.status(503).send(msg(true, "Missing payload"));
		else
			try {
				const chord = await Chord.findOne({
					where: {
						id: id,
					},
				});
				let data = [];
				await Terbaru.sequelize.query(
					"UPDATE `table_album` SET `visit`=visit+1 WHERE id =" + id
				);
				const like = await Like.findAndCountAll({
					where: {
						id_chord: id,
					},
				});
				let disukai = 0;
				if (req.query.user_id !== undefined) {
					const liked = await Like.findOne({
						where: {
							id_user: user_id,
							id_chord: id,
							soft_delete: 0,
						},
					});
					if (liked !== null) {
						disukai = 1;
					}
				}
				if (chord !== null) {
					data = { ...chord.dataValues, like: like["count"], disukai: disukai };
				}
				res.send(msg(false, "Successfull", data));
			} catch (err) {
				console.log(err.message);
				res.send(msg(true, err.message));
			}
	}
};

exports.getListBand = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { page, index } = req.body.payload;
		const { limit, offset } = getPagination(page, 10);
		if (!page || !index) res.status(503).send(msg(true, "Missing payload"));
		else
			try {
				const band = await Band.findAndCountAll({
					where: {
						abjad: index,
					},
					limit,
					offset,
				});
				res.send(getPagingData(band, page, limit));
			} catch (e) {
				console.log(e);
			}
	}
};

exports.getListBandCari = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { page, string } = req.body.payload;
		const { limit, offset } = getPagination(page, 10);
		if (!page || !string) res.status(503).send(msg(true, "Missing payload"));
		else
			try {
				const band = await Band.findAndCountAll({
					where: {
						nama: {
							[Op.like]: "%" + string + "%",
						},
					},
					limit,
					offset,
				});
				res.send(msg(false, "Successfull", getPagingData(band, page, limit)));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.getListLagu = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { page, band } = req.body.payload;
		const { limit, offset } = getPagination(page, 20);
		if (!page || !band) res.status(503).send(msg(true, "Missing payload"));
		else
			try {
				const lagu = await Lagu.findAndCountAll({
					where: {
						band: band,
					},
					limit,
					offset,
				});
				res.send(msg(true, "Successfull", getPagingData(lagu, page, limit)));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.getListLaguCari = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { page, string } = req.body.payload;
		const { limit, offset } = getPagination(page, 20);
		if (!page || !string) res.status(503).send(msg(true, "Missing payload"));
		else
			try {
				const lagu = await Lagu.findAndCountAll({
					where: {
						judul: {
							[Op.like]: "%" + string + "%",
						},
					},
					limit,
					offset,
				});
				res.send(msg(false, "Successfull", getPagingData(lagu, page, limit)));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.getLaguTerkait = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { id } = req.body.payload;
		if (!id) res.status(503).send(msg(true, "Missing payload"));
		else
			try {
				const band = await Lagu.findAll({
					where: {
						id: id,
					},
					limit: 1,
				});
				const lagu = await Lagu.findAll({
					where: {
						band: band[0].band,
						id: {
							[Op.not]: band[0].id,
						},
					},
					limit: 5,
				});
				const mirip = await Lagu.findAll({
					where: {
						judul: {
							[Op.like]: "%" + band[0].judul.split(" ")[0] + "%",
						},
						id: {
							[Op.not]: band[0].id,
						},
						band: {
							[Op.not]: band[0].band,
						},
					},
					limit: 5,
				});
				res.send(msg(false, "Successfull", lagu.concat(mirip)));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.getRekomendasi = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { flag } = req.body.payload;
		if (!flag) res.status(500).send(msg(true, "Flag is required"));
		else
			try {
				const daftar_flag = await Kategori.findAll({
					attributes: [
						[Sequelize.fn("DISTINCT", Sequelize.col("flag")), "flag"],
					],
				});
				const lagu =
					flag === "Terbaru" || flag === "Populer"
						? await Album.findAll({
								order: [[flag === "Terbaru" ? "createdAt" : "visit", "DESC"]],
								limit: 20,
						  })
						: await Kategori.findAll({
								where: {
									flag: flag,
									order: [["created_at", "DESC"]],
									limit: 20,
								},
						  });
				res.send(
					msg(false, "Successfull", {
						flag: daftar_flag.map((e) => {
							return e.flag;
						}),
						lagu,
					})
				);
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.getListCreated = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { page, user_id } = req.body.payload;
		const { limit, offset } = getPagination(page, 20);

		if (!page || !user_id) res.status(500).send(msg(true, "Flag is required"));
		else
			try {
				const lagu = await Lagu.findAndCountAll({
					where: {
						created_by: user_id,
					},
					limit,
					offset,
				});
				res.send(msg(false, "Successfull", getPagingData(lagu, page, limit)));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.likeLagu = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { id_chord, id_user } = req.body.payload;
		if (!id_chord || !id_user)
			res.status(500).send(msg(true, "Flag is required"));
		else
			try {
				const like = await Chord.findOne({
					where: {
						id: id_chord,
					},
				});
				if (like === null) {
					res.send(msg(true, "Chord not found"));
				} else {
					const suka = await Like.findOne({
						where: {
							id_user: id_user,
							id_chord: id_chord,
						},
					});
					if (suka === null) {
						await Like.create({
							id_user: id_user,
							id_chord: id_chord,
						});
						res.send(msg(false, "Successfull"));
					} else {
						if (Number(suka["soft_delete"]) === 1) {
							suka
								.update({
									soft_delete: 0,
								})
								.then((suka) => {
									res.send(msg(false, "Successfull"));
								});
						} else {
							res.send(msg(true, "Already Liked"));
						}
					}
				}
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.dislikeLagu = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { id_chord, id_user } = req.body.payload;
		if (!id_chord || !id_user)
			res.status(500).send(msg(true, "Flag is required"));
		else
			try {
				const like = await Chord.findOne({
					where: {
						id: id_chord,
					},
				});
				if (like === null) {
					res.send(msg(true, "Chord not found"));
				} else {
					const suka = await Like.findOne({
						where: {
							id_user: id_user,
							id_chord: id_chord,
						},
					});
					if (suka !== null) {
						if (Number(suka["soft_delete"]) === 0) {
							suka
								.update({
									soft_delete: 1,
								})
								.then((suka) => {
									res.send(msg(false, "Successfull"));
								});
						} else {
							res.send(msg(true, "Already Liked"));
						}
					} else {
						res.send(msg(true, "Like not found"));
					}
				}
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

exports.getLike = async (req, res, msg) => {
	if (req.method !== "GET")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { page, id_user } = req.body.payload;
		const { limit, offset } = getPagination(page, 15);
		if (!page || !id_user) res.status(500).send(msg(true, "Flag is required"));
		else
			try {
				const array = [];
				const like = await Like.findAll({
					attributes: ["id_chord"],
					where: {
						id_user: id_user,
						soft_delete: 0,
					},
					limit,
					offset,
				}).then(async function (result) {
					for (const id_chord of result) {
						const lagu = await Lagu.findOne({
							where: {
								id: id_chord.dataValues["id_chord"],
							},
						});
						if (lagu !== null) {
							array.push(lagu);
						}
					}
				});
				const message = {
					count: array.length,
					rows: array,
				};
				res.send(getPagingData(message, page, limit));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

// post
exports.postChord = async (req, res, msg) => {
	if (req.method !== "POST")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { judul, nama_band, chord, abjad, created_by, flag } =
			req.body.payload;
		if (!judul || !nama_band || !chord || !abjad || !created_by || !flag)
			res.status(500).send(msg(true, "Flag is required"));
		try {
			let { id, id_band } = 0;
			let band_status = "exist";
			let cek = await Lagu.findOne({
				where: {
					judul: judul,
					nama_band: nama_band,
				},
			});
			if (cek == null) {
				id_band = await Band.findOne({
					attributes: ["id"],
					where: {
						nama: nama_band,
					},
				});
				if (id_band == null) {
					id_band = await Band.findOne({
						attributes: [Sequelize.fn("max", Sequelize.col("id"))],
						raw: true,
					});
					//put band
					id_band = Number(id_band["max(`id`)"]) + 1;
					band_status = "new_band";
					const post = await Band.create({
						id: id_band,
						nama: nama_band,
						abjad: abjad,
					});
				} else {
					id_band = id_band["id"];
				}

				//put chord
				id = await Lagu.findOne({
					attributes: [Sequelize.fn("max", Sequelize.col("id"))],
					raw: true,
				});
				id = Number(id["max(`id`)"]) + 1;
				await Lagu.create({
					id: id,
					judul: judul,
					created_by: created_by,
					band: id_band,
					nama_band: nama_band,
					abjad: abjad,
				});
				await Chord.create({
					id: id,
					judul: judul,
					band: id_band,
					nama_band: nama_band,
					created_by: created_by,
					isi: chord,
					abjad: abjad,
				});
				await Kategori.create({
					id_lagu: id,
					judul: judul,
					nama_band: nama_band,
					flag: flag,
				});
				res.send(
					msg(false, "Successfull", {
						id: id,
						judul: judul,
						abjad: abjad,
						id_band: id_band,
						nama_band: nama_band,
						band_status: band_status,
					})
				);
			} else {
				res.send(msg(true, "Already Exist"));
			}
		} catch (e) {
			message = e.toString();
			console.log(e.message);
			res.send(msg(true, e.message));
		}
	}
};

exports.updateChord = async (req, res, msg) => {
	if (req.method !== "POST")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { id, judul, nama_band, chord, abjad } = req.body.payload;
		if (!judul || !nama_band || !chord || !abjad || !id)
			res.status(500).send(msg(true, "Flag is required"));
		else
			try {
				let abjad_id = Number(abjad);
				id_band = await Band.findOne({
					attributes: ["id"],
					where: {
						nama: nama_band,
					},
				});
				if (id_band == null) {
					id_band = await Band.findOne({
						attributes: [Sequelize.fn("max", Sequelize.col("id"))],
						raw: true,
					});
					//put band
					id_band = Number(id_band["max(`id`)"]) + 1;
					//band_status = "new_band";
					console.log("new band added");
					const post = await Band.create({
						id: id_band,
						nama: nama_band,
						abjad: abjad_id,
					});
				} else {
					id_band = id_band["id"];
				}
				await Chord.findByPk(id).then(function (ch) {
					ch.update({
						judul: judul,
						band: id_band,
						nama_band: nama_band,
						isi: chord,
						abjad: abjad_id,
					});
				});
				await Lagu.findByPk(id).then(function (ch) {
					ch.update({
						judul: judul,
						band: id_band,
						nama_band: nama_band,
						abjad: abjad_id,
					});
				});
				res.send(msg(false, "Successfull"));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, e.message));
			}
	}
};

// delete
exports.deleteChord = async (req, res, msg) => {
	if (req.method !== "DELETE")
		res.status(403).send(msg(true, "Methode not allowed"));
	else {
		const { id } = req.body.payload;
		if (!id) res.status(500).send(msg(true, "Flag is required"));
		else
			try {
				await Chord.findByPk(id).then(function (chord) {
					chord.destroy();
				});
				await Lagu.findByPk(id).then(function (lagu) {
					lagu.destroy();
				});
				res.send(msg(false, "Successfull", { id: id }));
			} catch (e) {
				console.log(e.message);
				res.send(msg(true, "id:" + id + " |" + e.message));
			}
	}
};
