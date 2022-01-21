import { AttributesRepository } from "modules/ChannelAdvisor/repositories/AttributesRepository";
import { IAttributesRepository } from "modules/ChannelAdvisor/repositories/IAttributesRepository";
import { IProductsRepository } from "modules/ChannelAdvisor/repositories/IProductsRepository";
import { ProductsRepository } from "modules/ChannelAdvisor/repositories/ProductsRepository";
import { container } from "tsyringe";

container.registerSingleton<IAttributesRepository>(
  "AttributesRepository",
  AttributesRepository
);
container.registerSingleton<IProductsRepository>(
  "ProductsRepository",
  ProductsRepository
);
