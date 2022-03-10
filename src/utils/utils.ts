class utils {
  static toHtml = (text: string[]) => {
    if (text.length === 0) {
      return "";
    }
    let output = text.join("- ");
    output = `<ul><li>${output.replaceAll("- ", "</li><li>")}</li></ul>`;

    return output;
  };
  static prettyName = (nameStr: string, modelStr: string, brandStr: string) => {
    let output = nameStr.replace(modelStr, "");
    output = output.replace(brandStr, "");
    output = output.replaceAll(",", "");
    return output.trim();
  };
  static removeDuplicateWords = (statement: string) => {
    return statement
      .split(" ")
      .filter(
        (item, pos, self) => item.match(/\d/) || self.indexOf(item) === pos
      )
      .join(" ");
  };
  static removeDuplicatedWordsBetween = (
    nameStr: string,
    modelStr: string,
    brandStr: string
  ) => {
    if (nameStr === null || modelStr === null || brandStr === null) {
      console.log("name is null");
      return "";
    }
    const name = nameStr.split(" ");
    const model = modelStr.split(" ");
    const brand = brandStr.split(" ");
    const str = name.filter(
      (item) => !model.includes(item) && !brand.includes(item)
    );
    const output = str
      .join(" ")
      .replaceAll(",", "")
      .replaceAll(":", "")
      .replaceAll(/\s+/g, " ");

    if (output[0] === "-") {
      return output.replace(str[0], "");
    }
    return output.trim();
  };
}
export { utils };
