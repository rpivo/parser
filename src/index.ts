#!/usr/bin/env node
import fs from 'fs';
import * as ReservedWords from './reservedWords.js';
import { CharTypes } from './charTypes.js';

type TreeNode = {
  declarations?: [];
  end?: number;
  kind?: string | null;
  start?: number;
  type?: string;
}

const body: TreeNode[] = [];

let index = 0;
let letterSequence: (string | number)[] = [];

const code = fs.readFileSync('./bin/example.js', 'utf-8');

const checkReservedWord = (word: string): [string | null, string] => {
  for (let WordType in ReservedWords.WordTypes) {
    if (ReservedWords[WordType][word]) return [WordType, word];
  }
  return [null, word];
};

const checkCharType = (char: string): string | null => {
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

const identifyPunctuation = (char: string, idx: number): void => {
  switch (char) {
    case ';':
      body[body.length - 1].end = idx + 1;
  }
};

const identifyWord = (): void => {
    const wordIndex = letterSequence.shift() as number;
    const [wordType, word] = checkReservedWord(letterSequence.join(''));

    let type = '';

    switch (wordType) {
      case ReservedWords.WordTypes.ControlFlow:
        break;
      case ReservedWords.WordTypes.Variables:
        type = 'VariableDeclaration';
        break;
    }

    if (type) body.push({
      declarations: [],
      kind: word,
      start: wordIndex,
      type,
    });

    letterSequence = [];
};

const createTree = () => {
  while (index < code.length) {
    const char = code[index];
  
    const charType = checkCharType(char);
  
    switch (charType) {
      case CharTypes.letter:
        if (!letterSequence.length) letterSequence.push(index);
        letterSequence.push(char);
        break;
  
      case CharTypes.punctuation:
        identifyPunctuation(char, index);
        break;
  
      case CharTypes.whitespace:
        if (letterSequence.length) identifyWord();
        break;
    }
  
    index++;
  }
  
  const ast = {
    'type': 'Program',
    'start': 0,
    'end': code.length,
    'body': body,
    'sourceType': 'module',
  };
  
  console.log(ast); 
}

createTree();