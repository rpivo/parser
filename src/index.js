import fs from 'fs';

const code = fs.readFileSync('./src/example.js', 'utf-8');

const ast = {
  'type': 'Program',
  'start': 0,
  'end': code.length,
  'body': [],
  'sourceType': 'module',
};

let it = 0;
let letterSequence = [];

while (it < code.length) {
  const char = code[it];
  const isLetter = /^[a-zA-Z]+$/.test(char);

  if (isLetter) letterSequence.push(char);
  console.log(code[it]);
  console.log('isLetter: ', isLetter);
  console.log('letterSequence', letterSequence);
  it++;
}