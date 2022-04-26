/* eslint-disable no-use-before-define */
/* eslint-disable no-continue */
/* eslint-disable no-unreachable-loop */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
import { Request, Response } from "express";

import { UpdateCategoriesService } from "../services/categories/updateCategoriesService";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createCategoryHandle(req: Request, res: Response) {
  try {
    const updateCategoriesService = new UpdateCategoriesService();
    const result = await updateCategoriesService.execute();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return "error";
  }
}
