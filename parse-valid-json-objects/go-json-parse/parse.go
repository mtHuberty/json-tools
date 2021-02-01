package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"

	"github.com/TylerBrock/colorjson"
)

func main() {
	path := "/Users/matthewhuberty/repos/json-tools/parse-valid-json-objects/sample-logfile-with-json.txt"
	f, err := os.Open(path)
	check(err)
	defer f.Close()

	// Make a limited capacity byte slice
	bytes := make([]byte, 50)

	var found bool
	var object string
	var count int

	// Read one piece at a time till end of file
	for err == nil {
		_, err = f.Read(bytes)

		for _, r := range string(bytes) {
			if len(object) > 10000 {
				object = ""
				found = false
				count = 0
			}

			char := string(r)

			if !found && char != "{" {
				continue
			}

			object += char

			if char == "{" {
				found = true
				count++
			} else if char == "}" && found {
				count--
			}

			if found && count == 0 {
				found = false

				var v map[string]interface{}

				err := json.Unmarshal([]byte(object), &v)
				if err != nil {
					fmt.Printf("UNMARSHAL ERROR: %s\n", err)
					object = ""
					continue
				}

				f := colorjson.NewFormatter()
				f.Indent = 2

				b, err := f.Marshal(v)
				if err != nil {
					fmt.Printf("MARSHAL ERROR: %s\n", err)
					object = ""
					continue
				}

				object = ""
				fmt.Printf("%s\n", string(b))
			}
		}
	}

	if !errors.Is(err, io.EOF) {
		fmt.Println(err)
	}
}

func check(e error) {
	if e != nil {
		panic(e)
	}
}
