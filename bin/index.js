#!/usr/bin/env node
import fs from 'fs';
import * as ReservedWords from './reservedWords.js';
const val = 'let';
if (val === ReservedWords.Variables.let)
    console.log('hello');
const code = fs.readFileSync('./bin/example.js', 'utf-8');
let it = 0;
let letterSequence = [];
while (it < code.length) {
    const char = code[it];
    const isLetter = /^[a-zA-Z]+$/.test(char);
    const isWhitespace = /\s/.test(char);
    if (isLetter)
        letterSequence.push(char);
    if (isWhitespace && letterSequence) {
        const word = letterSequence.join('');
        console.log('word', word);
        letterSequence = [];
    }
    ;
    it++;
}
const ast = {
    'type': 'Program',
    'start': 0,
    'end': code.length,
    'body': [],
    'sourceType': 'module',
};
