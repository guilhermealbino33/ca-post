import mongoose from "mongoose";

import { log } from "../../utils/log";

const connectDatabase = async () => {
  try {
    await mongoose.connect(`${process.env.ACCESS_URL}`, {});

    log("connection is ok");
  } catch (e) {
    console.log(e);
    log(`connection is error:${JSON.stringify(e)}`);
  }
};

const setup = async () => {
  await connectDatabase();
};

export { setup };
