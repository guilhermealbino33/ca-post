import { Schema } from "mongoose";

import { IProductInterface } from "./ProductInterface";

const Product = new Schema<IProductInterface>({
  code: String,
  data: {},
});

export { Product };
