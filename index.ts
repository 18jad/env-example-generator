#!/usr/bin/env node

import { program } from "commander";
import { EnvParser, IEnvParserOptions } from "./src/EnvParser";

program.version("0.0.1").description("Parse .env file into .env.example");

program.option("-e, --empty", "Empty values");

program.option("-c, --comments", "Comments");

program.option("-l, --linespace <number>", "Line space");

program.option("-s, --slug <string>", "Slug");

program.option("-p, --path <string>", "Path for .env file");

program.parse(process.argv);

const options = program.opts();

const envParserOptions: IEnvParserOptions = {
  emptyValue: options.empty || true,
  comments: options.comments || false,
  lineSpace: options.linespace || 1,
  slug: options.slug || "YOUR",
};

const parser = new EnvParser(envParserOptions);

parser.parse(options.path);
