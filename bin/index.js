#!/usr/bin/env node
import fs from 'fs';
import * as ReservedWords from './reservedWords.js';
import { CharTypes } from './charTypes.js';
// body of abstract syntax tree
const tree = [];
// global store of variable declarations for the file
const variableDeclarations = [];
let isAwaitingVariableName = false;
// array of character sequence that is currently being parsed. emptied out at the end of each word
let letterSequence = [];
const checkReservedWord = (word) => {
    for (let WordType in ReservedWords.WordTypes) {
        if (ReservedWords[WordType][word])
            return [WordType, word];
    }
    return [null, word];
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
const identifyPunctuation = (char, idx) => {
    switch (char) {
        case ';':
            tree[tree.length - 1].end = idx + 1;
    }
};
const identifyWord = () => {
    const wordIndex = letterSequence.shift();
    const [wordType, word] = checkReservedWord(letterSequence.join(''));
    // TODO: see if we can skip the switch below if we've entered this loop.
    if (isAwaitingVariableName) {
        variableDeclarations[variableDeclarations.length - 1]['name'] = word;
        isAwaitingVariableName = false;
    }
    let type = '';
    switch (wordType) {
        case ReservedWords.WordTypes.ControlFlow:
            break;
        case ReservedWords.WordTypes.Variables:
            type = 'VariableDeclaration';
            variableDeclarations.push({ type: word });
            isAwaitingVariableName = true;
            break;
    }
    if (type)
        tree.push({
            declarations: [],
            kind: word,
            start: wordIndex,
            type,
        });
    letterSequence = [];
};
const createTree = () => {
    const code = fs.readFileSync('./bin/example.js', 'utf-8');
    let index = 0;
    while (index < code.length) {
        const char = code[index];
        const charType = checkCharType(char);
        switch (charType) {
            case CharTypes.letter:
                if (!letterSequence.length)
                    letterSequence.push(index);
                letterSequence.push(char);
                break;
            case CharTypes.punctuation:
                identifyPunctuation(char, index);
                break;
            case CharTypes.whitespace:
                if (letterSequence.length)
                    identifyWord();
                break;
        }
        index++;
    }
    const ast = {
        'type': 'Program',
        'start': 0,
        'end': code.length,
        'body': tree,
        'sourceType': 'module',
    };
    console.log(ast);
    console.log(variableDeclarations);
};
createTree();
