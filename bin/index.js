#!/usr/bin/env node
import fs from 'fs';
import * as ReservedWords from './reservedWords.js';
import { CharTypes } from './charTypes.js';
const code = fs.readFileSync('./bin/example.js', 'utf-8');
const checkReservedWord = (word) => {
    for (let WordType in ReservedWords.WordTypes) {
        if (ReservedWords[WordType][word])
            return word;
    }
    return null;
};
const checkCharType = (char) => {
    const regs = {
        letter: /^[a-zA-Z]+$/,
        punctuation: /[=|{|}|(|)|;]/,
        whitespace: /\s/,
    };
    for (let [key, value] of Object.entries(regs)) {
        if (value.test(char))
            return key;
    }
    return null;
};
let it = 0;
let letterSequence = [];
const body = [];
while (it < code.length) {
    const char = code[it];
    const charType = checkCharType(char);
    console.log({ charType });
    switch (charType) {
        case CharTypes.letter:
            letterSequence.push(char);
            break;
        case CharTypes.punctuation:
            break;
        case CharTypes.whitespace:
            if (letterSequence) {
                const reservedWord = checkReservedWord(letterSequence.join(''));
                if (reservedWord) {
                    body.push({
                        type: 'VariableDeclaration',
                    });
                }
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
