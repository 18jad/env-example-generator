#!/usr/bin/env node

import { program } from "commander";

program.version("0.0.1").description("Parse .env file into .env.example");

program.option("-e, --empty", "Empty values");

program.option("-c, --comments", "Comments");

program.option("-l, --linespace <number>", "Line space");

program.option("-s, --slug <string>", "Slug");

program.option("-p, --path <string>", "Path for .env file");

program.parse(process.argv);

const options = program.opts();
