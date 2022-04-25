/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */

export function findParentID(category: any, createdCategories: any[]): any {
  if (category.parentCode === null) {
    return "0";
  }
  const foundCategory = createdCategories.find(
    (createdCategory) => createdCategory.code === category.parentCode
  );
  return foundCategory.lightspeedID;
}
export function findID(category: any, createdCategories: any[]): any {
  if (category.code === null) {
    return "0";
  }
  const foundCategory = createdCategories.find(
    (createdCategory) => createdCategory.code === category.code
  );
  return foundCategory.lightspeedID;
}
