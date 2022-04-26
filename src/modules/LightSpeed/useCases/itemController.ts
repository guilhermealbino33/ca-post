/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */

import { Request, Response } from "express";

import { UpdateItemsService } from "../services/items/updateItemsService";

export async function updateItemsHandle(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const updateItemsService = new UpdateItemsService();
    const result = await updateItemsService.execute();
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Error");
  }
}
