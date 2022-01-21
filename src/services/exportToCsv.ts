import fs from "fs";
import { parse } from "json2csv";

import { IProductInterface } from "../modules/QBP/models/ProductInterface";

class exportToCsv {
  static toCsv = (products: IProductInterface) => {
    try {
      const csv = parse(products, { fields: ["_id", "code", "data"] });
      const filename = "mongodb.csv";
      fs.writeFile(`./exports/${filename}`, csv, function err(err) {
        if (err) throw err;
        console.log("file saved");
      });
      return filename;
    } catch (err) {
      return console.error(err);
    }
  };
}

export { exportToCsv };
