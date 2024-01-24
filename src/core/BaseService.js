const { spawn } = require("child_process");
const debugFactory = require("debug");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

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

  /**
   * to specify whether debug messages should be outputted to the console
   */
  _shouldDebug = false;

  constructor(shouldDebug = false) {
    this._shouldDebug = shouldDebug;
  }

  #getDebug() {
    const moduleDebug = debugFactory(this._BASE_CMD);
    if (this._shouldDebug) {
      debugFactory.enable(this._BASE_CMD);
    }
    return moduleDebug;
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
    this._shouldDebug = true;
    return this;
  }

  /**
   * Build array of inputted arguments according to accepted Unoserver syntax for the command.
   * Can be overridden by sub-classes to add unique arguments
   */
  _prepareCmdArgs() {
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
        case "object":
          const arr = Object.keys(argValue);
          for (const index in arr) {
            const key = arr[index];
            const value = `${key}=${String(argValue[key])}`;
            cmdArgs.push(actualArg, value);
          }
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
    const baseCmd = this._BASE_CMD;

    const stdout = [];
    const stderr = [];

    const cmdArgs = this._prepareCmdArgs();
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
      debug("unoserver-node finished with code: %s", code);
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

      debug("Failed to start command process with error: \n%o", err);
    });

    debug(`Finished executing: ${cmdRan}`);
    return subProcess;
  }

  #validateImportantAttributes() {
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
  }

  /**
   * Executes built command
   * @returns ChildProcessWithoutNullStreams | Promise<String | Buffer>
   */
  run() {
    this.#validateImportantAttributes();

    // if no callback is defined, return a promise and assign a default callback to resolve or reject it
    if (this._runCallback === null) {
      return new Promise((resolve, reject) => {
        this._runCallback = (result, error) => {
          console.log("executing callback...");
          return error ? reject(error) : resolve(result);
        };
        // console.log("runcallback", this._runCallback);
        return this.#runCmd();
      });
    }

    return this.#runCmd();
  }

  /**
   * Async method that runs prepared command with a promisified child_process `exec(...)` function.
   * Will return a promise that resolves an object - {stdout, stderr}
   */
  async execCmd() {
    this.#validateImportantAttributes();
    const cmdRan = this.getCmd();
    const debug = this.#getDebug();
    debug(`Running command via exec: ${cmdRan}`);
    // return {stdout, stderr}
    const { stdout, stderr } = await exec(cmdRan);
    debug(`stdout: ${stdout}`);
    debug(`stderr: ${stderr}`);
    return { stdout, stderr };
  }

  printCmd() {
    const cmdArgs = this._prepareCmdArgs();
    const cmdRan = `${this._BASE_CMD} ${cmdArgs.join(" ")}`;
    console.log("Constructed command: ", cmdRan);
  }

  getCmd() {
    const cmdArgs = this._prepareCmdArgs();
    return `${this._BASE_CMD} ${cmdArgs.join(" ")}`;
  }
}
module.exports = BaseService;
