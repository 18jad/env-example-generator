"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserError = void 0;
class ParserError extends Error {
    constructor(message) {
        super(message);
        this.name = "ParserError";
    }
}
exports.ParserError = ParserError;
