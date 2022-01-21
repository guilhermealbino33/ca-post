import mongoose from "mongoose";

import { Product } from "../models/ProductSchema";

const product = mongoose.model("products", Product);

export { product };
