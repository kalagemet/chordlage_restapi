import express from "express";
import {
  getChord,
  getLaguPopuler,
  getLaguTerbaru,
  getLaguTerkait,
  getListBand,
  getListBandCari,
  getListLagu,
  getListLaguCari,
  postChord,
} from "../controllers/Chord.js";

const router = express.Router();

//get chord
router.get("/chord/:id", getChord);

//get list abjad
router.get("/abjad", getListBand);

//cari band
router.get("/band", getListBandCari);

//get list lagu band
router.get("/lagu", getListLagu);

// get list lagu cari
router.get("/cari", getListLaguCari);

//get terkait
router.get("/terkait/:id", getLaguTerkait);

//get terbaru
router.get("/terbaru", getLaguTerbaru);

//get popular
router.get("/populer", getLaguPopuler);

//post chord
router.post("/post", postChord);

export default router;
