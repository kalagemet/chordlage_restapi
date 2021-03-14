import express from "express";
import cors from "cors";
import db from "./config/database.js";
import router from "./routes/routes.js";
import basicAuthToken from "express-basic-token";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

try {
  db.authenticate();
} catch (error) {
  console.log(error);
}

app.use(
  basicAuthToken({
    token: "79fa2fcaecf5c83c299cd96e2ba44710", // md5 hash 6rw3xm49
    tokenName: "apa",
    invalidTokenJSON: { message: "Server Error" },
    notAuthorizedJSON: { message: "Not Allowed!" },
  })
);
app.use(router);

app.listen(5000, () => console.log("running"));
