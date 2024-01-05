const { spawn } = require("child_process");
const debugFactory = require("debug");

class BaseService {
  /**
   * arguments set by the user
   */
  _inputArgs = {};
  /**
   * callback to run after command is executed
   */
  _runCallback = null;

  /**
   * Map of user-readable unoserver flags to the actual shell flags. Must be overriden by sub-classes and defined
   */
  _CMD_ARGS_MAP = {};

  /**
   * primary unoserver command. This could be `unoserver`, `unoconvert`, or `unocompare` depending on the module.
   * Must be overriden by sub-classes and defined.
   */
  _BASE_CMD = null;

  #getDebug() {
    return debugFactory(this._BASE_CMD);
  }

  /**
   * Set callback function to be run when the child process closes
   * i.e. the process's stdio streams have been closed.
   * The callback signature must be (result, error) => {...}
   * @param {Function} runCallback
   * @returns self
   */
  setRunCallback(runCallback) {
    this._runCallback = runCallback;
    return this;
  }

  /**
   * Show debug messages on the console
   * @returns self
   */
  allowDebug() {
    this._inputArgs["shouldDebug"] = true;
    return this;
  }

  /**
   * Build array of inputted arguments according to accepted Unoserver syntax for the command
   */
  #prepareCmdArgs() {
    const cmdArgs = [];
    const cmdArgsMap = this._CMD_ARGS_MAP;
    const inputArgs = this._inputArgs;

    // loop over the object keys of the inputArgs
    // get the actual unoserver flag from the cmdArgsMap
    // slot this in the cmdArgs array (for booleans only if this is true)
    // check the value of inputArgs[key], if it is a string, slot it in the next position in cmdArgs
    // boolean values indicate the flag is a single argument flag & should have no value
    for (const arg in inputArgs) {
      if (!(arg in cmdArgsMap)) continue;
      const argValue = inputArgs[arg];
      const actualArg = cmdArgsMap[arg];

      switch (typeof argValue) {
        case "boolean":
          if (argValue) cmdArgs.push(actualArg);
          break;
        case "string":
        default:
          cmdArgs.push(actualArg, String(argValue));
      }
    }
    return cmdArgs;
  }

  #runCmd() {
    const debug = this.#getDebug();
    const runCallback = this._runCallback;
    const inputArgs = this._inputArgs;
    const shouldDebug = "shouldDebug" in inputArgs && inputArgs["shouldDebug"];
    const baseCmd = this._BASE_CMD;

    const stdout = [];
    const stderr = [];
    if (shouldDebug) {
      debugFactory.enable(baseCmd);
    }

    const cmdArgs = this.#prepareCmdArgs();
    const cmdRan = `${baseCmd} ${cmdArgs.join(" ")}`;
    debug(`Running command: ${cmdRan}`);
    const subProcess = spawn(baseCmd, cmdArgs);

    subProcess.stdout.on("data", (data) => {
      stdout.push(data);
    });

    subProcess.stderr.on("data", (data) => {
      stderr.push(data);
    });

    subProcess.on("close", (code) => {
      debug("node-unoserver finished with code: %s", code);
      if (stderr.length) {
        const error = new Error(Buffer.concat(stderr).toString("utf8"));
        debug("%o", error);
        debug("Executing runCallback with error...");
        return runCallback(null, error);
      }

      const result = Buffer.concat(stdout);
      debug("Executing runCallback with result...");
      runCallback(result);
    });

    subProcess.on("error", (err) => {
      if (err.message.indexOf("ENOENT") > -1) {
        debug("unoserver command not found. %o", err);
        return;
      }

      debug("%o", err);
    });

    debug(`Finished executing: ${cmdRan}`);
    return subProcess;
  }

  run() {
    // validate that necessary attributes are properly set
    if (Object.keys(this._CMD_ARGS_MAP).length === 0) {
      throw new Error(
        "Map of command arguments not defined or direct initialization of BaseService attempted"
      );
    }

    if (this._BASE_CMD === null) {
      throw new Error(
        "Base command not defined or direct initialization of BaseService attempted"
      );
    }

    // if no callback is defined, return a promise and assign a default callback to resolve or reject it
    if (this._runCallback === null) {
      // return new Promise((resolve, reject) => {
      //   this._runCallback = (result, error) => {
      //     console.log("executing callback");
      //     return error ? reject(error) : resolve(result);
      //   };
      //   console.log("runcallback", this._runCallback);
      //   return this.#runCmd();
      // });
      this._runCallback = (result, error) => {
        return error ? Promise.reject(error) : Promise.resolve(result);
      };
    }

    return this.#runCmd();
  }
}
module.exports = BaseService;
