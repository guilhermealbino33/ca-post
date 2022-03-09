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
  return output.join(" ").replaceAll(",", "").replaceAll(":", "").replaceAll(/\s+/g, ' ').replace("-", "").trim();
}

const nameStr = "- DT Swiss Champion Spoke:              2.0mm, 272mm, J - bend, Silver, Box of 100";
const modelStr = "Champion             2.0 Silver         Spokes: Box        of 100"; 
const brandStr = "DT Swiss";

// console.log("nameStr", nameStr.split(" "));
// console.log("modelStr", modelStr.split(" "));
// console.log("brandStr", brandStr.split(" "));

console.log("Old:", 
prettyName(nameStr, modelStr, brandStr));
console.log("New:", removeDuplicatedWordsBetween(nameStr, modelStr, brandStr));
