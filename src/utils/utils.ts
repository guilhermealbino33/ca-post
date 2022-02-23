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
    // output = Array.from(new Set(output.split(","))).toString();
    return output.trim();
  };
  static removeDuplicateCharacters = (statement: string) => {
    return statement
      .split(" ")
      .filter((item, pos, self) => {
        return self.indexOf(item) === pos;
      })
      .join(" ");
  };
}
export { utils };
