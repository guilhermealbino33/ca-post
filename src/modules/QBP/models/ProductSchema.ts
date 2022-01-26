import { Schema } from "mongoose";

import { IProductInterface } from "./ProductInterface";

const Product = new Schema<IProductInterface>({
  code: String,
  data: {
    code: String,
    name: String,
    model: {
      code: String,
      name: String,
      description: String,
      bulletPoints: [],
    },
    unit: String,
    manufacturerPartNumber: String,
    basePrice: Number,
    mapPrice: Number,
    msrp: Number,
    brand: {
      code: String,
      name: String,
    },
    discontinued: Boolean,
    weightsAndMeasures: {
      weight: {
        value: Number,
        unit: String,
      },
      length: {
        value: Number,
        unit: String,
      },
      width: {
        value: Number,
        unit: String,
      },
      height: {
        value: Number,
        unit: String,
      },
    },
    hazmat: Boolean,
    ormd: Boolean,
    thirdPartyAllowed: Boolean,
    intendedAgeWarningType: String,
    intendedAgeWarningText: String,
    chokingHazardWarningType: String,
    chokingHazardWarningText: String,
    prop65Text: String,
    orderProcess: String,
    images: [],
    categoryCodes: [],
    bulletPoints: [],
    barcodes: [],
    substitutes: [],
    smallParts: [],
    supersedes: [],
    seeAlsos: [],
    recommendations: [],
    productAttributes: [
      {
        value: String,
        name: String,
        unit: String,
      },
    ],
  },
});

export { Product };
