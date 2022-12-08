import * as fs from "fs";
import * as p from "path";
import { ParserError } from "./ParserError";

export interface IEnvParserOptions {
  emptyValue?: boolean;
  lineSpace?: number;
  comments?: boolean;
  slug?: string;
}

interface IParsedData {
  [key: string]: string;
}

export class EnvParser {
  public path: string | null;
  public absolutePath: string | null;
  public fileContent: string | null;
  public options: IEnvParserOptions;

  constructor(options?: IEnvParserOptions) {
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

  private checkPath = (path: string) => {
    if (!path) {
      throw new ParserError("Path is empty");
    }
    if (!fs.existsSync(path)) {
      throw new ParserError(`Path: "${this.absolutePath}" does not exist`);
    }
    return true;
  };

  private checkFile = (path: string) => {
    if (!fs.lstatSync(path).isFile()) {
      throw new ParserError(`Path: "${this.absolutePath}" is not a file`);
    }
    return true;
  };

  private checkExtension = (path: string) => {
    if (path.split(".").pop() !== "env") {
      throw new ParserError(`Path: "${this.absolutePath}" is not a .env file`);
    }
    return true;
  };

  private checkFileContent = (path: string) => {
    const fileContent = fs.readFileSync(path, "utf8");
    if (!fileContent) {
      throw new ParserError("File is empty");
    }
    return true;
  };

  private verify = (path: string) => {
    return new Promise<string>((resolve, reject) => {
      this.path = path;
      try {
        this.absolutePath = p.resolve(path);
        this.checkPath(path);
        this.checkFile(path);
        this.checkExtension(path);
        this.checkFileContent(path);
        resolve(this.absolutePath);
      } catch (error) {
        reject(error);
      }
    });
  };

  private isComment = (line: string) => {
    return line.trim().startsWith("#");
  };

  private cleanEmptySpaces = (lines: Array<string>) => {
    return lines.filter((line) => line != "\r");
  };

  private cleanComments = (lines: Array<string>) => {
    return lines.filter((line) => !this.isComment(line));
  };

  private parseEnv = (path: string) => {
    const fileContent: string = fs.readFileSync(path, "utf8");
    let lines: Array<string> = this.cleanEmptySpaces(fileContent.split("\n"));
    if (!this.options?.comments) {
      lines = this.cleanComments(lines);
    }
    const env: IParsedData = {};
    lines.forEach((line) => {
      const [key, _] = line.split("=");
      env[key] = this.options?.emptyValue
        ? ""
        : this.isComment(line)
        ? ""
        : `${this.options?.slug}_${key}`;
    });
    return env;
  };

  private writeExample = (envMap: IParsedData) => {
    let fileContent = "";
    let lineSpace = this.options?.lineSpace ? this.options?.lineSpace : 1,
      spaces = "\n";
    if (lineSpace < 0) throw new ParserError("lineSpace cannot be less than 0");
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
      fs.writeFile(
        examplePath,
        fileContent.trim(),
        {
          encoding: "utf8",
          flag: "w+",
        },
        (err) => {
          if (err) throw err;
          console.log(`✅ Example file created at: ${examplePath}`);
        },
      );
    }
  };

  public parse = (path: string) => {
    this.verify(path)
      .then(async (resolvedPath) => {
        const parsedResult = this.parseEnv(resolvedPath);
        this.writeExample(parsedResult);
      })
      .catch((error) => {
        throw new ParserError(error.message);
      });
  };
}
