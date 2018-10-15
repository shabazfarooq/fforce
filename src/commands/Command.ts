/**
 * Define and export module
 */
interface CommandInterface {
  _options: object;
  start(): void;
  hasOption(optionName: string): boolean;
}

/**
 * Define and export module
 */
module.exports = class Command implements CommandInterface {
  _options: object;

  constructor(options: object) {
    this._options = options;
  }

  get options() {
    return this._options;
  }

  start(): void{}

  hasOption(optionName: string): boolean {
    return this._options.hasOwnProperty(optionName);
  }
}