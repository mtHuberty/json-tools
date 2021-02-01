### Probably

* Clean up code
  * Add function wrappers to increase readability
* Add limits to levels of recursion for `parse-with-filter.js` (only go n levels deep into an object. probably place limit on the filter argument)
* Use streams instead of loading file into memory

### Maybe

* Use a flags library for accepting command line args
* Accept piped-in input from command line
* Rewrite in Go for speed?