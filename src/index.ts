#!/usr/bin/env node
import fs from 'fs';
import * as ReservedWords from './reservedWords.js';
import { CharTypes } from './charTypes.js';

const code = fs.readFileSync('./bin/example.js', 'utf-8');

const checkReservedWord = (word: string) => {
  for (let WordType in ReservedWords.WordTypes) {
    if (ReservedWords[WordType][word]) return [WordType, word];
  }
  return [null, word];
};

const checkCharType = (char: string) => {
  type RegExpObj = {
    [value: string]: RegExp;
  }

  const regs: RegExpObj = {
    letter: /^[a-zA-Z]+$/,
    punctuation: /[=|{|}|(|)|;]/,
    whitespace: /\s/,
  };

  for (let [key, value] of Object.entries(regs)) {
    if (value.test(char)) return key;
  }

  return null;
};

const identifyLetterSequence = (seq: (string | number)[]) => {
  console.log('hello');
  //   const wordIndex = letterSequence.shift();
  //   const [WordType, word] = checkReservedWord(letterSequence.join(''));

  //   if (WordType) {

  //   }
  //   // if (reservedWord) {
  //   //   body.push({
  //   //     type: 'VariableDeclaration',
  //   //     start: wordIndex,
  //   //   });
  //   // }
  //   letterSequence = [];
};

let it = 0;
let letterSequence = [];
const body: object[] = [];

while (it < code.length) {
  const char = code[it];

  const charType = checkCharType(char);

  switch (charType) {
    case CharTypes.letter:
      if (letterSequence.length === 0) letterSequence.push(it);
      letterSequence.push(char);
      break;

    case CharTypes.punctuation:
      break;

    case CharTypes.whitespace:
      if (letterSequence.length) {
        identifyLetterSequence(letterSequence);
        letterSequence = [];
      }
      break;
  }

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