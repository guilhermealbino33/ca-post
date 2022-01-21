import "reflect-metadata";
// import bodyParser from "body-parser";
import express from "express";

import { setup } from "../database/mongoDB";
import createConnection from "../database/typeorm";
import { router } from "../routes/index";

import "../container";

require("dotenv/config");

const api = express();
createConnection();
api.use(express.json());
api.use(router);
/*
api.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

api.use(bodyParser.json());
api.use("/uploads", express.static(`${process.cwd()}/uploads`));
api.use("/exports", express.static(`${process.cwd()}/exports`));
*/
setup().then(() => {
  api.listen(3335, () => {
    console.log("API listening on 3335");
  });
});
