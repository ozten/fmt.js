# fmt.js

Life is too short for style guides. gofmt for js. 

## Background
Leave nitpicking behind, fmt.js formats JavaScript programs.

Inspired by [gofmt](http://golang.org/cmd/gofmt/) and 
[Narcissus](https://github.com/mozilla/narcissus/),
`fmt.js` builds on [Reflect.js](https://github.com/zaach/reflect.js) to provide
a command line application for re-formatting source code into a canonical form.

## Status

A hint of being usable, let's turn this mother out!

Running will either:
* Output pretty-printed JavaScript
* Output UNKNOWN ast elements as well as pretty-printed JavaScript
* crash and burn in flames

## Installation

    # fork https://github.com/ozten/fmt.js
    git clone https://github.com/<me>/fmt.js.git
    npm install $path_to_repo -g

## Usage

    ./bin/fmt ~/project/foo.js