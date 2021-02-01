const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]

// valid json, something like {"ticketid": 12345}
const filterJSON = process.argv[3]
let filterObj

try {
  filterObj = JSON.parse(filterJSON)
} catch(e) {
  console.log("second arg to script must be valid JSON object with single key/value pair...exiting...")
  process.exit(1)
}

if (!filterObj || Object.keys(filterObj).length > 1) {
  console.error("only single key/val pair supported for filter")
  process.exit(1)
}

const prettyPrint = process.argv[4] === "pretty"

if (!inputPath) {
  console.error("no path provided")
  process.exit(1)
}

const filePath = path.join(__dirname, inputPath);

const text = fs.readFileSync(filePath, 'utf-8')

function findJSONObjects(text) {
  console.log('hey')

  let result = findNextObject(text, 0)

  const objects = []

  let loopProtectionCount = 0
  let loopProtectionLimit = 1000

  while (result  && loopProtectionCount < loopProtectionLimit) {
    console.log(loopProtectionCount)
    loopProtectionCount++
    objects.push(result.obj)
    // await waitASec()
    result = findNextObject(text, result.endIndex)
  }

  if (loopProtectionCount == loopProtectionLimit) {
    console.error("ERROR: Infinite loop detected...exiting...")
  }
}

function waitASec() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, 1000)
  })
}

// Return the next object, and the ending index for that object
function findNextObject(substr, startIndex) {
  console.log('ho')

  let count = 0
  let found = false

  let jsonStart, jsonEnd

  for (let i = startIndex; i < text.length; i++) {

    // If we found an object, and got back down to 0, we found the full thing. Snip it out and mark the end spot.
    if (found && count == 0) {
      jsonEnd = i
      const searchableObj = text.substring(jsonStart, jsonEnd)

      if (matchesFilterRecursive(filterObj, searchableObj)) {
        if (prettyPrint) {
          console.log(JSON.parse(searchableObj))
        } else {
          console.log(searchableObj)
        } 
      }

      return {obj: searchableObj, endIndex: jsonEnd}
    }

    if (text[i] === '{') {
      // This is the first open curly, let's mark the start spot
      if (!found) {
        jsonStart = i
      }

      // Mark that we're in an object now
      found = true
      count++
    } else if (text[i] === '}') {
      count--
    } else if (i == text.length) {
      return null
    }
  }
}

function matchesFilter(obj) {
  const filterKey = Object.keys(filter)[0]
  const filterVal = filter[filterKey]

  Object.keys(obj).forEach(key => {
    if (key === filterKey && obj[key] === filterVal) {
      return true
    }
  })

  return false
}


// returns a boolean
function matchesFilterRecursive(filterObj, searchableObj) {
  // expect filterObj to only have 1 key
  const keys = Object.keys(filterObj)
  if (keys.length != 1) {
    console.log(`filterObj doesn't have 1 key: ${filterObj}`)
    console.log('exiting...')
    process.exit(1)
  }

  const key = keys[0]

  const searchableKeys = Object.keys(searchableObj)

  let found = false

  for (let i = 0; i < searchableKeys.length; i++) {
    if (key === searchableKeys[i]) {
      found = true
      break
    }
  }

  if (!found) {
    return false
  }

  // if we found a matching key, is the filter key a primitive?
  if (typeof filterObj[key] === 'object') {
    // gotta go deeper
    return matchesFilterRecursive(filterObj[key], searchableObj[key])
  }

  if (filterObj[key] == searchableObj[key]) {
    return true
  } else {
    return false
  }
}

findJSONObjects(text)