"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvParser = void 0;
const fs = __importStar(require("fs"));
const p = __importStar(require("path"));
const ParserError_1 = require("./ParserError");
class EnvParser {
    constructor(options) {
        this.checkPath = (path) => {
            if (!path) {
                throw new ParserError_1.ParserError("Path is empty");
            }
            if (!fs.existsSync(path)) {
                throw new ParserError_1.ParserError(`Path: "${this.absolutePath}" does not exist`);
            }
            return true;
        };
        this.checkFile = (path) => {
            if (!fs.lstatSync(path).isFile()) {
                throw new ParserError_1.ParserError(`Path: "${this.absolutePath}" is not a file`);
            }
            return true;
        };
        this.checkExtension = (path) => {
            if (path.split(".").pop() !== "env") {
                throw new ParserError_1.ParserError(`Path: "${this.absolutePath}" is not a .env file`);
            }
            return true;
        };
        this.checkFileContent = (path) => {
            const fileContent = fs.readFileSync(path, "utf8");
            if (!fileContent) {
                throw new ParserError_1.ParserError("File is empty");
            }
            return true;
        };
        this.verify = (path) => {
            return new Promise((resolve, reject) => {
                this.path = path;
                try {
                    this.absolutePath = p.resolve(path);
                    this.checkPath(path);
                    this.checkFile(path);
                    this.checkExtension(path);
                    this.checkFileContent(path);
                    resolve(this.absolutePath);
                }
                catch (error) {
                    reject(error);
                }
            });
        };
        this.isComment = (line) => {
            return line.trim().startsWith("#");
        };
        this.cleanEmptySpaces = (lines) => {
            return lines.filter((line) => line != "\r");
        };
        this.cleanComments = (lines) => {
            return lines.filter((line) => !this.isComment(line));
        };
        this.parseEnv = (path) => {
            var _a;
            const fileContent = fs.readFileSync(path, "utf8");
            let lines = this.cleanEmptySpaces(fileContent.split("\n"));
            if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.comments)) {
                lines = this.cleanComments(lines);
            }
            const env = {};
            lines.forEach((line) => {
                var _a, _b;
                const [key, _] = line.split("=");
                env[key] = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.emptyValue)
                    ? ""
                    : this.isComment(line)
                        ? ""
                        : `${(_b = this.options) === null || _b === void 0 ? void 0 : _b.slug}_${key}`;
            });
            return env;
        };
        this.writeExample = (envMap) => {
            var _a, _b;
            let fileContent = "";
            let lineSpace = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.lineSpace) ? (_b = this.options) === null || _b === void 0 ? void 0 : _b.lineSpace : 1, spaces = "\n";
            if (lineSpace < 0)
                throw new ParserError_1.ParserError("lineSpace cannot be less than 0");
            for (let i = 0; i < lineSpace; i++) {
                spaces += "\r";
            }
            Object.keys(envMap).forEach((key) => {
                fileContent += this.isComment(key)
                    ? key
                    : `${key}=${envMap[key]}${spaces}`;
            });
            if (this.absolutePath) {
                const examplePath = this.absolutePath.replace(".env", ".env.example");
                fs.writeFile(examplePath, fileContent.trim(), {
                    encoding: "utf8",
                    flag: "w+",
                }, (err) => {
                    if (err)
                        throw err;
                    console.log(`✅ Example file created at: ${examplePath}`);
                });
            }
        };
        this.parse = (path) => {
            this.verify(path)
                .then((resolvedPath) => __awaiter(this, void 0, void 0, function* () {
                const parsedResult = this.parseEnv(resolvedPath);
                this.writeExample(parsedResult);
            }))
                .catch((error) => {
                throw new ParserError_1.ParserError(error.message);
            });
        };
        this.path = null;
        this.absolutePath = null;
        this.fileContent = null;
        this.options = options || {
            emptyValue: false,
            lineSpace: 1,
            comments: false,
            slug: "YOUR",
        };
    }
}
exports.EnvParser = EnvParser;
