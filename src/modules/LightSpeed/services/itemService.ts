/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import apiCentralizer from "services/Centralizer/api";
// import api from "services/LightSpeed/api";

// export async function getItemsByManufacturerSku(
//   manufacturerSku: string,
//   token: any
// ) {
//   const headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
//   try {
//     const item = await api.get(
//       `API/V3/Account/${process.env.ACCOUNT_ID}/Item.json?manufacturerSku=${manufacturerSku}`,
//       { headers }
//     );
//     const itemId = item.data?.Item?.itemID;
//     if (itemId && itemId !== undefined) {
//       console.log("manufacturerSku Returned", manufacturerSku);
//       return itemId;
//     }
//     return "";
//   } catch (error) {
//     console.log("error");
//     return error;
//   }
// }
export async function getCommonLshQbpItems(token: any) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  try {
    const items = await apiCentralizer.get(
      "/products/common-products-lsh-qbp",
      {
        headers,
      }
    );
    return items as any;
  } catch (error) {
    console.log("error");
    return error;
  }
}
