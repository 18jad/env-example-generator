#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const EnvParser_1 = require("./src/EnvParser");
commander_1.program.version("0.0.1").description("Parse .env file into .env.example");
commander_1.program.option("-e, --empty", "Empty values");
commander_1.program.option("-c, --comments", "Comments");
commander_1.program.option("-l, --linespace <number>", "Line space");
commander_1.program.option("-s, --slug <string>", "Slug");
commander_1.program.option("-p, --path <string>", "Path for .env file");
commander_1.program.parse(process.argv);
const options = commander_1.program.opts();
const envParserOptions = {
    emptyValue: options.empty || false,
    comments: options.comments || false,
    lineSpace: options.linespace || 1,
    slug: options.slug || "YOUR"
};
const parser = new EnvParser_1.EnvParser(envParserOptions);
parser.parse(options.path || "");
