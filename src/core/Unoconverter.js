const BaseService = require("./BaseService");

class Unoconverter extends BaseService {
  _BASE_CMD = "unoconvert";
  _CMD_ARGS_MAP = {
    convertTo: "--convert-to",
    filter: "--filter",
    filterOption: "--filter-option",
    host: "--host",
    port: "--port",
    hostLocation: "--host-location",
  };

  #validHostLocations = { auto: "auto", local: "local", remote: "remote" };

  #requiredCmdArgs = ["inFile", "outFile"];

  _inputArgs = { filterOption: {} };

  /**
   * The file type/extension of the output file (ex pdf).
   * Required when using stdout
   * @param {String} convertTo
   * @returns self
   */
  setConvertTo(convertTo) {
    this._inputArgs.convertTo = convertTo;
    return this;
  }

  /**
   * The export filter to use when converting.
   * It is selected automatically if not specified.
   * @param {String} filter
   * @returns self
   */
  setFilter(filter) {
    this._inputArgs.filter = filter;
    return this;
  }

  /**
   * Attach an option for the export filter, in name=value format. Use true/false for boolean values.
   * Can be repeated for multiple options. it is not always clear what options are available, this depends on the
   * version of LibreOffice. These filter options are specific to the document format being exported to.
   * See details in the export filter section here: https://manpages.ubuntu.com/manpages/trusty/man1/doc2odt.1.html
   * @param {String} optionName
   * @param {String|Number|Boolean} value
   * @returns self
   */
  addFilterOption(optionName, value) {
    this._inputArgs.filterOption[optionName] = value;
    return this;
  }

  /**
   * Sets the host used by the server, defaults to "127.0.0.1"
   * @param {String} host
   * @returns self
   */
  setHost(host) {
    this._inputArgs.host = host;
    return this;
  }

  /**
   * Sets the port used by the server, defaults to "2002"
   * @param {String} port
   * @returns self
   */
  setPort(port) {
    this._inputArgs.port = port;
    return this;
  }

  /**
   * Sets the host location. This determines the handling of files and can only be one of three values -
   * `auto`, `remote`, and `local`. If you run the client on the same machine as the server, it can be set to `local`,
   * and the files are sent as paths. If they are different machines, it is `remote` and the files are sent as binary data.
   * Default is `auto`, and it will send the file as a path if the host is `127.0.0.1` or `localhost`,
   * and binary data for other hosts.
   * @param {String} hostLocation
   * @returns self
   */
  setHostLocation(hostLocation) {
    if (!(hostLocation in this.#validHostLocations)) {
      throw new Error("Invalid host location");
    }
    this._inputArgs.hostLocation = hostLocation;
    return this;
  }

  /**
   * Sets the path to the file to be converted (use - for stdin)
   * @param {String} inFile
   * @returns self
   */
  setInFile(inFile) {
    this._inputArgs.inFile = inFile;
    return this;
  }

  /**
   * Sets the path to the converted file (use - for stdout)
   * @param {String} outFile
   * @returns self
   */
  setOutFile(outFile) {
    this._inputArgs.outFile = outFile;
    return this;
  }

  _prepareCmdArgs() {
    // validate that required arguments have been set
    this.#validateRequiredCmdArgs();
    const cmdArgs = super._prepareCmdArgs();

    // stack on inFile and outFile in that order
    cmdArgs.push(this._inputArgs.inFile, this._inputArgs.outFile);
    return cmdArgs;
  }

  #validateRequiredCmdArgs() {
    for (const cmdArg of this.#requiredCmdArgs) {
      if (!(cmdArg in this._inputArgs) || !this._inputArgs[cmdArg]) {
        throw new Error(`${cmdArg} must be set and valid`);
      }
    }
  }
}

module.exports = Unoconverter;
