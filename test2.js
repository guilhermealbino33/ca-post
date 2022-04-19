const categories = require("./src/modules/QBP/database/categories.json");
const categoriesMock = categories.categories;

const createdCategory = [
  { categoryID: '1233', code: 'g0' },
  { categoryID: '1234', code: 'cw-special-categories' },
  { categoryID: '1235', code: 'cw-rims' },
  { categoryID: '1236', code: 'g27' }
];

let parentCode;

function findParentID(category) {
      console.log("category", category);
      if (category.parentCode === null) {
        console.log("entrou");
        const code = createdCategory.find(
          ({ code }) => code === category.code
        );
        // console.log("code if null", code);
        parentCode = code?.categoryID || "0";
        return code;
      }
      const code = createdCategory.find(
        ({ code }) => code === category.parentCode
      );
      // console.log("code if not null", code);
      parentCode = code?.categoryID || "0";
      return code;
      // console.log("code", code);
    }
    categoriesMock.forEach(category => {
/* for (const category of categoriesMock) { */
  console.log("parentCode", parentCode);
  const data = {
    name: category.name,
    parentID: parentCode || "0",
  };
  findParentID(category);
  // parentCode = newParentCode?.categoryID || "0";
  console.log("parentCode 2", parentCode);
  console.log("data", data);
// }    
  
});

/**
 * Bolar um IF PARENT CODE != "g0" then...
 */