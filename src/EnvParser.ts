import * as fs from "fs";
import * as p from "path";
import { ParserError } from "./ParserError";

/**
 * Options for the EnvParser class
 */
export type EnvParserOptions = {
  emptyValue?: boolean;
  lineSpace?: number;
  comments?: boolean;
  slug?: string;
};

/**
 * An object representing the parsed .env file data
 */
type EnvData = Record<string, string>;

export class EnvParser {
  public path: string | null;
  public absolutePath: string | null;
  public fileContent: string | null;
  public options: EnvParserOptions;
  private saveAs: string = ".env.example";
  private readonly extension: string = ".env";

  constructor(options?: EnvParserOptions) {
    this.path = null;
    this.absolutePath = null;
    this.fileContent = null;
    this.options = options || {
      emptyValue: false,
      lineSpace: 1,
      comments: false,
      slug: "YOUR"
    };
  }

  /**
   * Check if path is valid, if path is empty, and current directory contain a .env resolve it as path
   * @param path: string
   * @returns
   */
  private checkPath = (path: string): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      if (!path || path == "") {
        // Set current directory as path
        const currentDir = `${p.resolve(".")}\\${this.extension}`;
        // Check if there's any .env file in the current directory
        const checkFile = await this.checkFile(currentDir);

        if (checkFile) {
          resolve(currentDir);
        }
        reject("No .env file found in current directory");
      } else {
        if (!fs.existsSync(path)) {
          reject(`Path: "${this.absolutePath}" does not exist`);
        }
      }
      resolve(path);
    });
  };

  /**
   * Check if a file path exists
   * @param path: string
   * @returns
   */
  private checkFile = async (path: string) => {
    return fs.promises
      .access(path, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
  };

  /**
   * Check if the file extension is .env
   * @param path: string
   * @returns
   */
  private checkExtension = (path: string) => {
    if (!path.endsWith(this.extension)) {
      throw new ParserError("File extension is not .env");
    }

    return true;
  };

  /**
   * Check if the file is empty
   * @param path: string
   * @returns
   */
  private checkIfEmpty = async (path: string) => {
    try {
      const stats = await fs.promises.stat(path);
      return stats.size === 0;
    } catch {
      return false;
    }
  };

  /**
   * Test all the conditions and return the absolute path
   * @param path
   * @returns: absolutePath: Promise<string>
   */
  private verify = (path: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      this.path = path;
      try {
        this.absolutePath = p.resolve(path);
        this.checkPath(path)
          .then((resolvedPath: string) => {
            this.checkFile(resolvedPath);
            this.checkExtension(resolvedPath);
            this.checkIfEmpty(resolvedPath);
            this.absolutePath = resolvedPath;
          })
          .then(() => {
            if (this.absolutePath == null)
              throw new ParserError("Path is null");
            resolve(this.absolutePath);
          })
          .catch((error) => {
            throw new ParserError(error);
          });
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
    const fileContent = fs.readFileSync(path, "utf8");
    let lines = this.cleanEmptySpaces(fileContent.split("\n"));
    if (!this.options?.comments) {
      lines = this.cleanComments(lines);
    }
    const env: EnvData = {};
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const [key] = line.split("=");
      // bad way to implement this, but it is what it is
      if (key.trim() == "@ignore") {
        i++;
        continue;
      }
      env[key] = this.options?.emptyValue
        ? ""
        : this.isComment(line)
        ? ""
        : `${this.options?.slug}_${key}`;
    }
    return env;
  };

  private writeExample = (envMap: EnvData) => {
    let fileContent = "";
    let lineSpace = this.options?.lineSpace ? this.options?.lineSpace : 1,
      spaces = "\r\n"; // \r\n to avoid characters errors
    if (lineSpace < 0) throw new ParserError("lineSpace cannot be less than 0");
    for (let i = 0; i < lineSpace; i++) {
      spaces += "\r\n";
    }
    const keys = Object.keys(envMap);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      if (key?.trim() == "" || key?.trim() == "\r" || key?.trim() == "\n") {
        i++;
      } else {
        fileContent += this.isComment(key)
          ? `${key}\n`
          : `${key}= ${envMap[key]}${spaces}`;
      }
    }

    if (this.absolutePath) {
      // check if this.absolutePath is absolute path
      if (!p.isAbsolute(this.absolutePath))
        this.absolutePath = p.resolve(this.absolutePath);
      const examplePath = this.absolutePath.replace(
        this.extension,
        this.saveAs
      );
      fs.writeFile(
        examplePath,
        fileContent.trim(),
        {
          encoding: "utf8",
          flag: "w+"
        },
        (err) => {
          if (err) throw err;
          console.log(`✅ Example file created at: ${examplePath}`);
        }
      );
    }
  };

  public parse = (path: string) => {
    this.verify(path)
      .then((resolvedPath) => {
        const parsedResult = this.parseEnv(resolvedPath);
        this.writeExample(parsedResult);
      })
      .catch((error) => {
        throw new ParserError(error.message);
      });
  };
}
