import axios from "axios";
import _ from "lodash";
import { QueueAdvisorCategoryRepository } from "modules/Cron/repositories/QueueAdvisorRepository";

import { setup } from "../database/mongoDB";
import "../infra/config-env";

const getProductCodeList = async () => {
  const url = "https://clsdev.qbp.com/api3/1";

  const config = {
    baseURL: url,
    headers: {
      Accept: "application/json",
      "X-QBPAPI-KEY": `${process.env.API_KEY}`,
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

    await QueueAdvisorCategoryRepository.collection.bulkWrite(
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
