#!/usr/bin/env node

"use strict";

var path = require("path");
var fs = require("fs");

var args = require("minimist")( process.argv.slice(2), {
    boolean: [ "help" ],
    string: [ "file" ]
});
if(args.help) {
    printHelp();
} else if(args.file) {
    processFile( path.resolve(arg.file) );
} else {
    error("Incorrect usage.", true);
}


function processFile(filepath) {
    var contents = fs.readFileSync(filepath);
    console.log(contents);
}

function error(msg, includeHelp = false) {
    console.error(msg);
    if(includeHelp) {
        console.log("");
        printHelp();
    }
}
// printHelp()

// console.log("Hello world");
// process.stdout.write("Hello World");

// console.log("hello world")
// console.error("Oops")

// node ex1.js 2> /dev/null  # the 2 redirects standard error
// 1> is standard out

//*******************
function printHelp() {
    console.log("ex1 usage");
    console.log("ex1.js --help");
    console.log("");
    console.log("--help             print this help");
    console.log("--file={FILENAME}  print file name");
    console.log("")
}