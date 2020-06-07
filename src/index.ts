#!/usr/bin/env node
import fs from 'fs';
import * as ReservedWords from './reservedWords.js';

const code = fs.readFileSync('./bin/example.js', 'utf-8');

const checkReservedWord = (word: string) => {
  for (let WordType in ReservedWords.WordTypes) {
    if (ReservedWords[WordType][word]) return word;
  }
  return null;
};

let it = 0;
let letterSequence = [];
const body: object[] = [];

while (it < code.length) {
  const char = code[it];

  const isLetter = /^[a-zA-Z]+$/.test(char);
  const isWhitespace = /\s/.test(char);

  if (isLetter) letterSequence.push(char);
  if (isWhitespace && letterSequence) {
    const word = letterSequence.join('');
    const reservedWord = checkReservedWord(word);
    if (reservedWord) {
      body.push({
        type: 'VariableDeclaration',
      });
    }
    letterSequence = [];
  };

  it++;
}

const ast = {
  'type': 'Program',
  'start': 0,
  'end': code.length,
  'body': body,
  'sourceType': 'module',
};

console.log(ast);