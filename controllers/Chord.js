import Chord from "../models/Chord.js";
import Band from "../models/Band.js";
import Lagu from "../models/Lagu.js";
import Terbaru from "../models/Terbaru.js";
import { Sequelize } from "sequelize";

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

export const getChord = async (req, res) => {
  try {
    const chord = await Chord.findAll({
      where: {
        id: req.params.id,
      },
    });
    await Terbaru.sequelize.query(
      "UPDATE `table_album` SET `visit`=visit+1 WHERE id =" + req.params.id
    );
    res.send(chord[0]);
  } catch (err) {
    console.log(err);
  }
};

export const getListBand = async (req, res) => {
  const { page, index } = req.query;
  const { limit, offset } = getPagination(page, 10);

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
};

export const getListBandCari = async (req, res) => {
  const { page, string } = req.query;
  const { limit, offset } = getPagination(page, 10);

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
    res.send(getPagingData(band, page, limit));
  } catch (e) {
    console.log(e);
  }
};

export const getListLagu = async (req, res) => {
  const { page, band } = req.query;
  const { limit, offset } = getPagination(page, 10);

  try {
    const lagu = await Lagu.findAndCountAll({
      where: {
        band: band,
      },
      limit,
      offset,
    });
    res.send(getPagingData(lagu, page, limit));
  } catch (e) {
    console.log(e);
  }
};

export const getListLaguCari = async (req, res) => {
  const { page, string } = req.query;
  const { limit, offset } = getPagination(page, 10);

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
    res.send(getPagingData(lagu, page, limit));
  } catch (e) {
    console.log(e);
  }
};

export const getLaguTerkait = async (req, res) => {
  try {
    const band = await Lagu.findAll({
      where: {
        id: req.params.id,
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
    res.send(lagu.concat(mirip));
  } catch (e) {
    console.log(e);
  }
};

export const getLaguTerbaru = async (req, res) => {
  try {
    const lagu = await Terbaru.findAll({
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    res.send(lagu);
  } catch (e) {
    console.log(e);
  }
};

export const getLaguPopuler = async (req, res) => {
  try {
    const lagu = await Terbaru.findAll({
      order: [["visit", "DESC"]],
      limit: 2,
    });
    res.send(lagu);
  } catch (e) {
    console.log(e);
  }
};

export const postChord = async (req, res) => {
  let message = "";
  try {
    const { judul, nama_band, chord, abjad } = req.body;
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
        band: id_band,
        nama_band: nama_band,
        abjad: abjad,
      });
      await Chord.create({
        id: id,
        judul: judul,
        band: id_band,
        nama_band: nama_band,
        isi: chord,
        abjad: abjad,
      });

      message = {
        error: false,
        msg: "Sukses",
        id: id,
        judul: judul,
        abjad: abjad,
        id_band: id_band,
        nama_band: nama_band,
        band_status: band_status,
      };
    } else {
      message = {
        error: true,
        msg: "Already exist",
      };
    }
  } catch (e) {
    message = e.toString();
    console.log(e);
  }
  res.send(message);
};
