const BaseService = require("./BaseService");

class Unoserver extends BaseService {
  _CMD_ARGS_MAP = {
    serverInterface: "--interface",
    port: "--port",
    unoInterface: "--uno-interface",
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
   * Set the port used by the XMLRPC server. This defaults to "2003"
   * @param {String} port
   * @returns self
   */
  setPort(port) {
    this._inputArgs["port"] = port;
    return this;
  }

  /**
   * Sets the interface used by the LibreOffice server. Defaults to "2002"
   * @param {String} unoInterface
   * @returns self
   */
  setUnoInterface(unoInterface) {
    this._inputArgs["unoInterface"] = unoInterface;
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
   * If unoserver is run as a daemon, this file will nt be deleted when unoserver exits
   * @param {String} processIdFile
   * @returns self
   */
  setProcessIdFile(processIdFile) {
    this._inputArgs["processIdFile"] = processIdFile;
    return this;
  }
}
module.exports = Unoserver;
