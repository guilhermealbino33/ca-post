/* eslint-disable @typescript-eslint/no-explicit-any */
import sleep from "./sleep";
import { TimesInMilli } from "./Times";

export const lockRequest = async (response: any): Promise<void> => {
  const apiBucketLevel = response.headers["x-ls-api-bucket-level"];
  console.log(`x-ls-api-bucket-level:`, apiBucketLevel);

  // will throw 429 error (too many requests)
  const [apiBucketLevelF, apiBucketLevelS] = apiBucketLevel.split("/");
  if (apiBucketLevelS - apiBucketLevelF < 1) {
    console.log(`Server will be busy, sleeping one minute`);
    await sleep(TimesInMilli.OneMinute);
  }
};
