import axios from "axios";
import _ from "lodash";

import { setup } from "../../../database/mongoDB";
import "../../../infra/config-env";
import { ProductQueueRepository } from "../repositories/QueueRepository";

const getProductCodeList = async () => {
  const url = "https://clsdev.qbp.com/api3/1";
  const key = "994675804a77949ba12e40dad5afaaf6";

  const config = {
    baseURL: url,
    headers: {
      Accept: "application/json",
      "X-QBPAPI-KEY": key,
    },
  };

  const response = await axios.get("/productcode/list", config);

  return response.data;
};

const execute = async () => {
  const { codes } = await getProductCodeList();

  const chunks = _.chunk(codes, 1000);

  for (let index = 0; index < chunks.length; index += 1) {
    console.log(`saving ${index} chunk with 1000 elements`);

    const chunk = chunks[index];

    await ProductQueueRepository.collection.bulkWrite(
      chunk.map((code) => ({
        updateOne: {
          filter: {
            code,
          },
          update: {
            $set: {
              code,
            },
          },
          upsert: true,
        },
      }))
    );
  }
};

(async () => {
  await setup();
  await execute();
})();
