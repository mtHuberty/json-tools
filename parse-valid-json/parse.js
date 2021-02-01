const fs = require('fs')
const path = require('path')

const inputPath = process.argv[2]

const prettyPrint = process.argv[3] === "pretty"

if (!inputPath) {
  console.error("no path provided")
  process.exit(1)
}

const filePath = path.join(__dirname, inputPath);

const text = fs.readFileSync(filePath, 'utf-8')

async function findJSONObjects(text) {
  let result = findNextObject(text, 0)

  const objects = []

  let loopProtectionCount = 0
  let loopProtectionLimit = 1000

  while (result  && loopProtectionCount < loopProtectionLimit) {
    loopProtectionCount++
    objects.push(result.obj)
    await waitASec()
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
  let count = 0
  let found = false

  let jsonStart, jsonEnd

  for (let i = startIndex; i < text.length; i++) {

    // If we found an object, and got back down to 0, we found the full thing. Snip it out and mark the end spot.
    if (found && count == 0) {
      jsonEnd = i
      const obj = text.substring(jsonStart, jsonEnd)
      if (prettyPrint) {
        console.log(JSON.parse(obj))
      } else {
        console.log(obj)
      }
      return {obj: obj, endIndex: jsonEnd}
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

findJSONObjects(text)