#!/usr/bin/env node

import SignLang from "../index.js";
import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";

let fileName, input;

argv.forEach((arg, idx) => {
    if (arg.split(".").pop() === "dsh") {
        fileName = arg;
    }
    else if (arg === "-i") {
        input = argv[++idx];
    }
})

if (!fileName) throw Error("File not Specified");

const src = readFileSync(fileName, { encoding: "utf-8" });
const Sign = new SignLang();

if (input) Sign.setInput(input);

console.log(Sign.intepret(src));

exit(0);