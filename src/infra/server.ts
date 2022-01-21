import "reflect-metadata";
import express from "express";

import { setup } from "../database/mongoDB";
import { router } from "../routes/index";

const api = express();
api.use(express.json());
api.use(router);

setup().then(() => {
  api.listen(3336, () => {
    console.log("API listening on 3336");
  });
});
