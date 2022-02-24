const prettyName = (nameStr, modelStr, brandStr) => {
  let output = nameStr.replace(modelStr, "");
  output = output.replace(brandStr, "");
  output = output.replaceAll(",", "");
  return output.trim();
};
const removeDuplicateWords = (statement) => {
  return statement
    .split(" ")
    .filter((item, pos, self) => item.match(/\d/) || self.indexOf(item) === pos)
    .join(" ");
};

const removeDuplicatedWordsBetween = (nameStr, modelStr, brandStr) => {
  let output; 
  nameStr = nameStr.split(" ");
  modelStr = modelStr.split(" ");
  brandStr = brandStr.split(" ");
  output = nameStr.filter(item => !modelStr.includes(item) && !brandStr.includes(item));
  return output.join(" ").replaceAll(",", "").trim();
}

const nameStr = 'Surly Rolling Darryl Rim 26" 32h Black';
const modelStr = "Rolling Darryl"; 
const brandStr = "Surly";

// console.log("nameStr", nameStr.split(" "));
// console.log("modelStr", modelStr.split(" "));
// console.log("brandStr", brandStr.split(" "));

console.log("Old:", 
prettyName(nameStr, modelStr, brandStr));
console.log("New:", removeDuplicatedWordsBetween(nameStr, modelStr, brandStr));
