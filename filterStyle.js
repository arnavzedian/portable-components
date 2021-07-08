import objectFromCSS from './objectFromCSS';
import viewSupportedStyle from './viewSupportedStyle.json';
import textSupportedStyle from './textSupportedStyle.json';
import units from './viewportSize';

function camelCaseToHyphenCase(theString) {
  return theString.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

let {vw, vh, vmin, vmax} = units;
console.log('aaaaaa', vw, vh, vmin, vmax);

function removeUnit(val) {
  return val
    .replace('vw', '')
    .replace('vh', '')
    .replace('vmin', '')
    .replace('vmax', '');
}

function parseValue(val) {
  let unitsToProcess = {vw: vw, vh: vh, vmax: vmax, vmin: vmin};

  for (let unit in unitsToProcess) {
    if (val.indexOf(unit) !== -1) {
      let withoutUnit = Number(removeUnit(val));
      let newVal = withoutUnit * unitsToProcess[unit];
      // console.log('newVal', newVal, val);
      return newVal;
    }
  }

  return val;
}

function getCSS(field, obj) {
  let value = obj[field];
  value = parseValue(value);

  return `${camelCaseToHyphenCase(field)}:${value}`;
}

function removePseudoStyle(styleString) {
  styleString = styleString.replace(/\*(.|\n)*?\*/gi, '');
  styleString = styleString.replace(/\n/gi, '');
  return styleString.replace(/;(.*)}/gi, ';');
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

function transformStyle(field, value) {
  let possibleTransformation = {
    borderTop: ['Width', 'Style', 'Color'],
  };

  possibleTransformation.borderRight = possibleTransformation.borderTop;
  possibleTransformation.borderBottom = possibleTransformation.borderTop;
  possibleTransformation.borderLeft = possibleTransformation.borderTop;

  let transformations = possibleTransformation[field];

  if (!transformations) return null;

  let newObj = {};

  let values = value.split(' ');
  for (let i = 0; i < values.length; i++) {
    if (transformations[i]) {
      let newField = field + transformations[i];
      if (transformations[i] == 'Style') {
        newField = 'borderStyle';
      }
      newObj[newField] = values[i];
    }
  }

  return newObj;
}

function filterStyle(literal, props) {
  let styleString = processTemplateLiterals(literal, props);

  styleString = removePseudoStyle(styleString);

  let viewStyle = ['flex-direction:row'];
  let textStyle = [];

  if (!styleString)
    return {
      view: viewStyle.join(';'),
      text: '',
    };

  styleString = styleString.replace(/\n/g, '');

  // console.log(literal, styleString);

  let obj = objectFromCSS(styleString);

  for (let field in obj) {
    // console.log(viewSupportedStyle.includes(field), field);

    if (viewSupportedStyle.includes(field)) {
      if (field == 'position' && obj[field] == 'fixed') {
        obj[field] = 'absolute';
        // console.log('fixed positon is not supported, using absolute position');
      }
      viewStyle.push(getCSS(field, obj));
    }

    if (textSupportedStyle.includes(field)) {
      textStyle.push(getCSS(field, obj));
    }

    if (!viewSupportedStyle.includes(field)) {
      let transformedStyle = transformStyle(field, obj[field]);
      if (transformedStyle) {
        for (let newField in transformedStyle) {
          viewStyle.push(getCSS(newField, transformedStyle));
        }
      } else {
        // console.log(field + ' is not supported');
      }
    }
  }

  return {
    view: viewStyle.join(';'),
    text: textStyle.join(';'),
  };
}

export default filterStyle;
