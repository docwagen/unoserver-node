## DocWagen Unoserver-Node

Unoserver-Node is a lightweight NodeJs wrapper for the [unoserver python library](https://github.com/unoconv/unoserver) that interacts with
LibreOffice's Universal Network Objects (UNO) APIs to convert between different, supported document formats.

### Requirements

To use this package in your node projects, you need to install the following on your computer (or server):

1. LibreOffice: see installation instructions for your OS platform [here](https://www.libreoffice.org/get-help/install-howto/)
2. Unoserver: see installation instructions [here](https://github.com/unoconv/unoserver#installation)

### Usage

Unoserver-Node provides three (3) modules that contain classes that support the three commands provided by unoserver (`unoserver`, `unoconvert`, and `unocompare`).
