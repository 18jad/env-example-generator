export interface IEnvParserOptions {
  emptyValue?: boolean;
  lineSpace?: number;
  comments?: boolean;
  slug?: string;
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
      emptyValue: true,
      lineSpace: 1,
      comments: false,
      slug: "YOUR",
    };
  }
}
