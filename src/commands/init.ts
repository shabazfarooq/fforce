/**
 * Require(s)
 */
const Command = require('./Command');
const userInput = require('../utilities/userInput');
const jsforceUtilities = require('../utilities/jsforceUtilities');
const filesystemUtilities = require('../utilities/filesystemUtilities');

/**
 * Define and export module
 */
module.exports = class Init extends Command {
  _username: string;
  _password: string;
  _instanceUrl: string;

  /**
   * Start
   */
  async start() {
    try {
      // Capture user credentials
      this.captureSetValidateCredentials();
      
      // Authenticate with SFDC
      let authenticatedCredentials = await jsforceUtilities.getAuthenticatedCredentials(
        this._username,
        this._password,
        this._instanceUrl
      );

      // Create local files if credentials authenticated
      if (authenticatedCredentials) {
        this.createLocalFilesAndDirectories();
      }
    }
    catch (error) {
      console.log('failed..' + error);
      process.exit(1);
    }
  }

  /**
   * Capture user credentials
   */
  captureSetValidateCredentials(): void {
    const hidePassword = super.hasOption('showpassword') === false;

    // Capture user credentials
    this._username = userInput.askUser('Enter username');
    this._password = userInput.askUser('Enter password', hidePassword);
    this._instanceUrl = userInput.askUser('Enter instance type(test/login/full URL)');
    
    // Finalize instance URL
    if (this._instanceUrl === 'test' || this._instanceUrl === 'login') {
      this._instanceUrl = 'https://' + this._instanceUrl + '.salesforce.com';
    }

    // Validate user credentials
    if (!this._username || !this._password || !this._instanceUrl) {
      throw 'Missing username/password/instance type';
    }
  }

  /**
   * Create local files and directories
   */
  createLocalFilesAndDirectories(): void {
    filesystemUtilities.createBuildPropertiesFile(
      this._username, this._password, this._instanceUrl
    );
    filesystemUtilities.createBuildXmlFile();
    filesystemUtilities.createPackageXmlFile();
    filesystemUtilities.createExecuteAnonFile();
    filesystemUtilities.createQueryFile();
  }

}
