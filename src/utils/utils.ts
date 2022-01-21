class utils {
  static toHtml = (text: string[]) => {
    let output = text.join("- ");
    output = `<ul><li>${output.replaceAll("- ", "</li><li>")}</li></ul>`;

    return output;
  };
  static prettyName = (nameStr: string, modelStr: string, brandStr: string) => {
    let output = nameStr.replace(modelStr, "");
    output = output.replace(brandStr, "");

    return output.trim();
  };
}
export { utils };
