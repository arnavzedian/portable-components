import objectFromCSS from './objectFromCSS';
import viewSupportedStyle from './viewSupportedStyle.json';
import textSupportedStyle from './textSupportedStyle.json';
import {vw, vh, vmin, vmax} from './viewportSize';

function camelCaseToHyphenCase(theString) {
  return theString.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

function removeUnit(val) {
  return val
    .replace('vw', '')
    .replace('vh', '')
    .replace('vmin', '')
    .replace('vmax', '');
}

function parseValue(val) {
  return val.replace('vw', '%').replace('vh', '%');

  let unitsToProcess = {vw: vw, vh: vh, vmax: vmax, vmin: vmin};

  for (let unit in unitsToProcess) {
    if (val.indexOf(unit) !== -1) {
      let withoutUnit = Number(removeUnit(val));
      return withoutUnit * unitsToProcess[unit];
    }
  }

  return val;
}

function getCSS(field, obj) {
  let value = obj[field];
  value = parseValue(value);

  return `${camelCaseToHyphenCase(field)}:${value}`;
}

function processTemplateLiterals(literal, props) {
  let dynamicsLength = literal[0].length;
  let strings = literal[0];
  let dynamic = literal[1];

  let style = '';

  for (let i = 0; i < dynamicsLength; i++) {
    style += strings[i];

    if (dynamic[i]) {
      let val = '';
      if (typeof dynamic[i] == 'function') {
        let func = dynamic[i];
        val = func(props);
      } else {
        val = dynamic[i].toString();
      }

      style += val;
    }
  }

  return style;
}

function filterStyle(literal, props) {
  let styleString = processTemplateLiterals(literal, props);

  if (!styleString)
    return {
      view: '',
      text: '',
    };

  let viewStyle = [];
  let textStyle = [];

  styleString = styleString.replace(/\n/g, '');

  // console.log(literal, styleString);

  let obj = objectFromCSS(styleString);

  for (let field in obj) {
    // console.log(viewSupportedStyle.includes(field), field);

    if (viewSupportedStyle.includes(field)) {
      viewStyle.push(getCSS(field, obj));
    } else if (textSupportedStyle.includes(field)) {
      textStyle.push(getCSS(field, obj));
    } else {
      console.log(field + ' is not supported');
    }
  }

  return {
    view: viewStyle.join(';'),
    text: textStyle.join(';'),
  };
}

export default filterStyle;
