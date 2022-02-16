class utils {
  static toHtml = (text: string[]) => {
    if (text.length < 1) {
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
}
export { utils };
