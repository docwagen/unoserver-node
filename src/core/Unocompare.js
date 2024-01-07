const BaseService = require("./BaseService");

class Unocompare extends BaseService {
  _BASE_CMD = "unocompare";
  _CMD_ARGS_MAP = {
    fileType: "--file-type",
    host: "--host",
    port: "--port",
    hostLocation: "--host-location",
  };

  #validHostLocations = ["auto", "local", "remote"];

  #requiredCmdArgs = ["oldFile", "newFile", "outFile"];

  /**
   * Sets the file type/extension of the result output file (e.g. "pdf").
   * This is required when using stdout
   * @param {String} fileType
   * @returns self
   */
  setFileType(fileType) {
    this._inputArgs["fileType"] = fileType;
    return this;
  }

  /**
   * Sets the host used by the server, defaults to "127.0.0.1"
   * @param {String} host
   * @returns self
   */
  setHost(host) {
    this._inputArgs["host"] = host;
    return this;
  }

  /**
   * Sets the port used by the server, defaults to "2002"
   * @param {String} port
   * @returns self
   */
  setPort(port) {
    this._inputArgs["port"] = port;
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
    this._inputArgs["hostLocation"] = hostLocation;
    return this;
  }

  /**
   * Sets the path to the older file to be compared with the original one (use - for stdin)
   * @param {String} oldFile
   * @returns self
   */
  setOldFile(oldFile) {
    this._inputArgs["oldFile"] = oldFile;
    return this;
  }

  /**
   * Sets the path to the newer file to be compared with the modified one (use - for stdin)
   * @param {String} newFile
   * @returns self
   */
  setNewFile(newFile) {
    this._inputArgs["newFile"] = newFile;
    return this;
  }

  /**
   * Sets the path to the result of the comparison and converted file (use - for stdout)
   * @param {String} outFile
   * @returns self
   */
  setOutFile(outFile) {
    this._inputArgs["outFile"] = outFile;
    return this;
  }

  _prepareCmdArgs() {
    // validate that required arguments have been set
    this.#validateRequiredCmdArgs();
    const cmdArgs = super._prepareCmdArgs();

    // stack on oldFile, newFile and outFile in that order
    cmdArgs.push(
      this._inputArgs["oldFile"],
      this._inputArgs["newFile"],
      this._inputArgs["outFile"]
    );
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

module.exports = Unocompare;
