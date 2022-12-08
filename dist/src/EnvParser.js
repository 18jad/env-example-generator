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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvParser = void 0;
const fs = __importStar(require("fs"));
const p = __importStar(require("path"));
const ParserError_1 = require("./ParserError");
class EnvParser {
    constructor(options) {
        this.extension = ".env";
        this.saveAs = ".env.example";
        this.checkPath = (path) => {
            return new Promise((resolve, reject) => {
                if (!path || path == "") {
                    const currentDir = `${p.resolve(".")}\\${this.extension}`;
                    if (this.checkFile(currentDir)) {
                        resolve(currentDir);
                    }
                    reject("Path is empty");
                }
                else {
                    if (!fs.existsSync(path)) {
                        reject(`Path: "${this.absolutePath}" does not exist`);
                    }
                }
                resolve(path);
            });
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
                    this.checkPath(path)
                        .then((resolvedPath) => {
                        this.checkFile(resolvedPath);
                        this.checkExtension(resolvedPath);
                        this.checkFileContent(resolvedPath);
                        this.absolutePath = resolvedPath;
                    })
                        .then(() => {
                        if (this.absolutePath == null)
                            throw new ParserError_1.ParserError("Path is null");
                        resolve(this.absolutePath);
                    })
                        .catch((error) => {
                        throw new ParserError_1.ParserError(error);
                    });
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
            var _a, _b, _c;
            const fileContent = fs.readFileSync(path, "utf8");
            let lines = this.cleanEmptySpaces(fileContent.split("\n"));
            if (!((_a = this.options) === null || _a === void 0 ? void 0 : _a.comments)) {
                lines = this.cleanComments(lines);
            }
            const env = {};
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const [key, _] = line.split("=");
                // bad way to implement this, but it is what it is
                if (key.trim() == "@ignore") {
                    i++;
                    continue;
                }
                env[key] = ((_b = this.options) === null || _b === void 0 ? void 0 : _b.emptyValue)
                    ? ""
                    : this.isComment(line)
                        ? ""
                        : `${(_c = this.options) === null || _c === void 0 ? void 0 : _c.slug}_${key}`;
            }
            return env;
        };
        this.writeExample = (envMap) => {
            var _a, _b;
            let fileContent = "";
            let lineSpace = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.lineSpace) ? (_b = this.options) === null || _b === void 0 ? void 0 : _b.lineSpace : 1, spaces = "\r\n"; // \r\n to avoid characters errors
            if (lineSpace < 0)
                throw new ParserError_1.ParserError("lineSpace cannot be less than 0");
            for (let i = 0; i < lineSpace; i++) {
                spaces += "\r\n";
            }
            const keys = Object.keys(envMap);
            for (let i = 0; i < keys.length; ++i) {
                const key = keys[i];
                if ((key === null || key === void 0 ? void 0 : key.trim()) == "" || (key === null || key === void 0 ? void 0 : key.trim()) == "\r" || (key === null || key === void 0 ? void 0 : key.trim()) == "\n") {
                    i++;
                }
                else {
                    fileContent += this.isComment(key)
                        ? `${key}\n`
                        : `${key}= ${envMap[key]}${spaces}`;
                }
            }
            if (this.absolutePath) {
                // check if this.absolutePath is absolute path
                if (!p.isAbsolute(this.absolutePath))
                    this.absolutePath = p.resolve(this.absolutePath);
                const examplePath = this.absolutePath.replace(this.extension, this.saveAs);
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
                .then((resolvedPath) => {
                const parsedResult = this.parseEnv(resolvedPath);
                this.writeExample(parsedResult);
            })
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
