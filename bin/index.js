#!/usr/bin/env node

import SignLang from "../index.js";
import { readFileSync } from "node:fs";
import { argv, exit } from "node:process";

let fileName, input;

for (let idx = 0; idx < argv.length; ++idx) {
    const arg = argv[idx];

    if (arg.split(".").pop() === "sign") {
        fileName = arg;
    }
    else if (arg === "-i") {
        input = argv[++idx];
    }
}

if (!fileName) {
    console.log("[Sign]: No Path Specified");
    exit(1);
}

let src;
try {
    src = readFileSync(fileName, { encoding: "utf-8" });
}
catch ({ code }) {
    if (code === "ENOENT") {
        console.log("[Sign]: File not Found");
        exit(1);
    }
    else throw new Error("Unknown Error. Please report this issue on GitHub");
}

const Sign = new SignLang();

if (input) Sign.setInput(input);

console.log(Sign.intepret(src));

exit(0);