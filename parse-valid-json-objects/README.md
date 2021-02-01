## Goal

Parse text files for valid JSON objects, and prints them to stdout. 

*NOTE: This loads the entire file into memory. Don't use this with large files*
*NOTE: This works for (and prints) entire top-level objects only, not arrays*

### Scripts

#### parse.js

Parses file for any valid JSON object and prints found objects to stdout. First argument should be a relative filepath to the file to be parsed. Adding a second argument of "pretty" will enable pretty printed JAVASCRIPT (not valid json) objects.

```bash
node parse.js ./sample-logfile-with-json.txt pretty
```

#### parse-with-filter.js

Smarter version of the previous script. First argument should be a relative filepath. Second argument should be a string of valid JSON that can be any number of levels deep, but each level should contain only a single key/value pair. If third argument (optional) is "pretty", JAVASCRIPT (not valid json) objects will be pretty-printed.

```bash
node parse-with-filter.js /Users/matthewhuberty/repos/json-tools/parse-valid-json-objects/sample-logfile-with-json.txt '{"junk":"json"}' pretty
```

