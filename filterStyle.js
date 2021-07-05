import objectFromCSS from "./objectFromCSS";
import viewSupportedStyle from "viewSupportedStyle.json";
import textSupportedStyle from "textSupportedStyle.json";

function camelCaseToHyphenCase(theString) {
  return theString.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
}

function getCSS(field, obj) {
  return `${camelCaseToHyphenCase(field)}:${obj[field]}`;
}

function filterStyle(styleString) {
  let viewStyle = [];
  let textStyle = [];

  let obj = objectFromCSS(styleString);

  for (let field in obj) {
    if (viewSupportedStyle.includes(field)) {
      viewStyle.push(getCSS(field, obj));
    } else if (textSupportedStyle.includes(field)) {
      textStyle.push(getCSS(field, obj));
    } else {
      console.log(field + " is not supported");
    }
  }

  return {
    view: viewStyle.join(";"),
    text: textStyle.join(";"),
  };
}

export default filterStyle;
