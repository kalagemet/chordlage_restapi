const {
	getChord,
	getRekomendasi,
	getLaguTerkait,
	getListBand,
	getListBandCari,
	getListLagu,
	getListLaguCari,
	postChord,
	deleteChord,
	getListCreated,
	getLike,
	updateChord,
	likeLagu,
	dislikeLagu,
} = require("../controllers/Chord.js");
var md5 = require("md5");

// Main Controller
const mainController = async (req, res) => {
	let auth = JSON.parse(JSON.stringify(req.body));
	auth.token = md5("whattheapks");
	console.log("token: " + md5(JSON.stringify(auth) + md5("whattheapks")));
	try {
		req.body.token !== md5(JSON.stringify(auth) + md5("whattheapks"))
			? res.status(403).send(message(true, "Credential not accepted"))
			: eval(req.body.route)(req, res, message);
	} catch (e) {
		res.status(404).send(message(true, e.message));
	}
};

let message = (error, msg, data) => {
	err = typeof error === "boolean" ? error : false;
	return {
		error: err,
		msg: msg,
		data: data,
	};
};

module.exports = mainController;
// //get chord
// router.get("/chord/:id", getChord);

// //get list abjad
// router.get("/abjad", getListBand);

// //cari band
// router.get("/band", getListBandCari);

// //get list lagu band
// router.get("/lagu", getListLagu);

// // get list lagu cari
// router.get("/cari", getListLaguCari);

// //get terkait
// router.get("/terkait/:id", getLaguTerkait);

// //get terbaru
// router.get("/terbaru", getLaguTerbaru);

// //get popular
// router.get("/populer", getLaguPopuler);

// //post chord
// router.post("/post", postChord);

// //delete chord
// router.delete("/destroy", deleteChord);

// //update chord
// router.put("/update", updateChord);

// //get lagu buatan
// router.get("/created", getListCreated);

// //get lagu disukai
// router.get("/disukai", getLike);

// //sukai lagu
// router.post("/sukai", likeLagu);

// //batal sukai lagu
// router.post("/batalsuka", dislikeLagu);
