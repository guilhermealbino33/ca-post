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

  output = output.join(" ")
                 .replaceAll(",", "")
                 .replaceAll(":", "")
                 .replaceAll(/\s+/g, ' ')

  console.log("char1", output[0]);
  if (output[0] == "-") {
    console.log("entrou");
    output = output.replace(output[0], "");
  }

  return output.trim();
}

const nonZeroReturn = (value) => {
  if (value !== 0) {
    return JSON.stringify(value);
  }
  return "";
};

const msrp = 110;
const nameStr = "Sutherland's Repair/Maintenance Guide: 7th Edition Book & CD";
const modelStr = "Sutherland's 7th Edition Book & CD"; 
const brandStr = "Sutherlands";

// console.log("nameStr", nameStr.split(" "));
// console.log("modelStr", modelStr.split(" "));
// console.log("brandStr", brandStr.split(" "));
console.log("MSRP", nonZeroReturn(msrp));
console.log("Old:", 
prettyName(nameStr, modelStr, brandStr));
console.log("New:", removeDuplicatedWordsBetween(nameStr, modelStr, brandStr));
