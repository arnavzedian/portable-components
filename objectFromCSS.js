function caps(theString) {
  let firstLetter = theString.substr(0, 1).toUpperCase();
  return firstLetter + theString.substr(1, theString.length);
}

function toCamelCase(theString) {
  if (theString.indexOf('-') === -1) return theString;
  let split = theString.split('-');
  let parts = [split[0]];
  for (let i = 1; i < split.length; i++) {
    parts.push(caps(split[i]));
  }
  return parts.join('');
}

export default function objectFromCSS(theString) {
  if (!theString) return {};
  let lines = theString.split(';');
  let obj = {};

  for (let line of lines) {
    if (!line.trim()) continue;
    if (line.indexOf(':') == -1) {
      console.log('invalid line ' + line);
      continue;
    }
    let lineSplit = line.split(':');

    let field = lineSplit[0].trim();
    let value = lineSplit[1].trim();
    field = toCamelCase(field);
    obj[field] = value;
  }
  return obj;
}
