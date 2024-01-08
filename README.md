## DocWagen Unoserver-Node

Unoserver-Node is a lightweight NodeJs wrapper for the [unoserver python library](https://github.com/unoconv/unoserver) that interacts with
LibreOffice's Universal Network Objects (UNO) APIs to convert between different, supported document formats.

### Requirements

To use this package in your node projects, you need to install the following on your computer (or server):

1. LibreOffice: see installation instructions for your OS platform [here](https://www.libreoffice.org/get-help/install-howto/)
2. Unoserver: see installation instructions [here](https://github.com/unoconv/unoserver#installation)

### Usage

Unoserver-Node provides three (3) modules that contain classes that support the three commands provided by unoserver (`unoserver`, `unoconvert`, and `unocompare`). It is worth noting that `unoserver` must be running before the other commands are run.

#### Running the unoserver command

The `Unoserver` class in this package supports the `unoserver` command which basically starts a libreoffice listener on a specified IP and port for `unoconverter` and `unocompare` to connect to to perform their operations.

The arguments or flags to the `unoserver` command are represented as attributes of an internal object in the `Unoserver` class. These attributes can be set via the public methods of the class. The builder creational design pattern is used here to allow method chaining of these **set*Attribute*** methods. The code snippet below illustrates this.  
This way of representing command arguments as attributes and allowing the chaining of class setter methods is general to all the core classes.

```js
const { Unoserver } = require("unoserver-node");
// constructor of all core can accept a `shouldDebug` optional, boolean parameter that specifies if execution messages should be printed to console
// setting `shouldDebug = true` is similar to calling the `allowDebug()` method on all objects of the core classes
const unoserver = new Unoserver(true);
const unoServerProcess = unoserver
  .setServerInterface("127.0.0.1")
  .setPort("2003")
  .makeDaemon()
  .run();
```

The following attributes can be set (their descriptions are mostly from the [unoserver documentation](https://github.com/unoconv/unoserver#usage)):

- **_serverInterface_**: the interface used by the XMLRPC server (for internal communication between unoserver and the other modules). This defaults to "127.0.0.1" if not set.

- **_port_**: the port used by the XMLRPC server. This defaults to "2003".

- **_unoInterface_**: the interface used by the LibreOffice server. Defaults to "2002".

- **_daemon_**: attribute to run unoserver as a daemon. This is the only attribute that does not have a direct setter method. The `makeDaemon()` method sets it internally.

- **_libreOfficePath_**: the path to the LibreOffice executable.

- **_libreOfficeUserProfilePath_**: the path to the LibreOffice user profile. Will default to a dyamically created temporary directory.

- **_processIdFile_**: the path to a file that the LibreOffice Process ID will be written to. If unoserver is run as a daemon, this file will nt be deleted when unoserver exits.

#### Running the unoconvert command

The `Unoconverter` class supports the `unoconvert` command. This connects to a listener to try to convert a document into different, supported formats.

#### Running the unocompare command

The `unocompare` command is supported by the `Unocompare` class, which connects to a listener, tries to compare two documents, and converts the resulting document. See an example code snippet below:

```js
const { Unocompare } = require("unoserver-node");
const unoCompareProcess = new Unocompare(true)
  .setOldFile(OLD_FILE_PATH)
  .setNewFile(NEW_FILE_PATH)
  .setOutFile(OUT_FILE_PATH)
  .run();
```

The server must be running before this command is executed. The following attributes are available:

- **_fileType_**: The file type/extension of the result output file (ex pdf). Required when using stdout.

- **_host_**: The server host. Defaults to "127.0.0.1".

- **_port_**: The server port, defaults to "2002".

- **_hostLocation_**: This determines the handling of files and can only be one of three values - `auto`, `remote`, and `local`. If you run the client on the same machine as the server, it can be set to `local`, and the files are sent as paths. If they are different machines, it is `remote` and the files are sent as binary data. Default is `auto`, and it will send the file as a path if the host is `127.0.0.1` or `localhost`, and binary data for other hosts.

- **_oldFile_**: The path to the older file to be compared with the original one (for stdin). This attribute is required.

- **_newFile_**: The path to the newer file to be compared with the modified one (for stdin). Also required.

- **_outFile_**: The path to the result of the comparison and converted file (for stdout). Also required.
