const express = require("express");
const cors = require("cors");
const db = require("./config/database.js");
const router = require("./routes/routes.js");
const basicAuthToken = require("express-basic-token");

const app = express();
// for parsing application/json
app.use(express.json());
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const start = async () => {
	try {
		await db.authenticate();
	} catch (error) {
		console.log(error);
	}
};
start();

app.use(
	basicAuthToken({
		token: "79fa2fcaecf5c83c299cd96e2ba44710", // md5 hash 6rw3xm49
		tokenName: "access-token",
		invalidTokenJSON: { message: "Invalid Key" },
		notAuthorizedJSON: { message: "Not Allowed!" },
	})
);
app.use(router);

app.listen(5001, () => console.log("running"));
