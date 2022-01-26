import mongoose from "mongoose";

import { Product } from "../models/ProductSchema";

const ProductRepository = mongoose.model("products", Product);

export { ProductRepository };
