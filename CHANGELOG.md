### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### 2.2.0

- fixed bug with the `setPort` methods
- added `setUnoPort` method to `Unoserver` class to set the libreoffice port
- added the new unoserver v2.1 `--input-filter` & `--output-filter` options with the `setInputFilter` & `setOutputFilter` methods in the `Unoserver` class

#### 2.1.0

- fix: wrong mapping for filter in `Unoconverter` class command argument map
- feat: trim and automatically wrap string arguments in single quotes to prevent commands from failing when string arguments contain spaces
- added documentation on HTML to DOCX conversions

#### 2.0.2

- fix: bug with execCmd method not printing debug msgs

#### 2.0.1

- project structure, BaseService & Unoserver implementations [`302b2fb`](https://github.com/docwagen/unoserver-node/commit/302b2fb51d81b27a8482acaed5b8b8bd1b0b53f0)
- feat: allowing multiple unoconverter export filter options [`e7dc10b`](https://github.com/docwagen/unoserver-node/commit/e7dc10bde55000498ae64dba5f514ae80e177eac)
- adding auto changelog generator [`3c533b6`](https://github.com/docwagen/unoserver-node/commit/3c533b61bf7b47995abf99bec29c298bcc494777)
