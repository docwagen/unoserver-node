const BaseService = require("./BaseService");

class Unoserver extends BaseService {
  _CMD_ARGS_MAP = {
    serverInterface: "--interface",
    port: "--port",
    unoInterface: "--uno-interface",
    unoPort: "--uno-port",
    daemon: "--daemon",
    libreOfficePath: "--executable",
    libreOfficeUserProfilePath: "--user-installation",
    processIdFile: "--libreoffice-pid-file",
  };

  _BASE_CMD = "unoserver";

  /**
   * Sets the interface used by the XMLRPC server (for internal communication between unoserver and the other modules).
   * This defaults to "127.0.0.1" if not set
   * @param {String} serverInterface
   * @returns self
   */
  setServerInterface(serverInterface) {
    this._inputArgs["serverInterface"] = serverInterface;
    return this;
  }

  /**
   * Sets the interface used by the LibreOffice server. Defaults to "127.0.0.1"
   * @param {String} unoInterface
   * @returns self
   */
  setUnoInterface(unoInterface) {
    this._inputArgs["unoInterface"] = unoInterface;
    return this;
  }

  /**
   * Sets the port used by the LibreOffice server. Defaults to "2002"
   * @param {String} unoPort
   * @returns self
   */
  setUnoPort(unoPort) {
    this._inputArgs["unoPort"] = Number.parseInt(unoPort);
    return this;
  }

  /**
   * Daemonizes unoserver.
   * @returns self
   */
  makeDaemon() {
    this._inputArgs["daemon"] = true;
    return this;
  }

  /**
   * Sets the path to the LibreOffice executable
   * @param {String} libreOfficePath
   * @returns self
   */
  setLibreOfficePath(libreOfficePath) {
    this._inputArgs["libreOfficePath"] = libreOfficePath;
    return this;
  }

  /**
   * Sets the path to the LibreOffice user profile. Will default to a dyamically created temporary directory.
   * @param {String} userProfilePath
   * @returns self
   */
  setLibreOfficeUserProfilePath(userProfilePath) {
    this._inputArgs["libreOfficeUserProfilePath"] = userProfilePath;
    return this;
  }

  /**
   * Sets the path to a file that the LibreOffice Process ID will be written to.
   * If unoserver is run as a daemon, this file will not be deleted when unoserver exits
   * @param {String} processIdFile
   * @returns self
   */
  setProcessIdFile(processIdFile) {
    this._inputArgs["processIdFile"] = processIdFile;
    return this;
  }
}
module.exports = Unoserver;
