#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var fs = require("fs");
var Transform = require("stream").Transform;
var zlib = require("zlib");

const BASEPATH =
path.resolve(process.env.BASEPATH || __dirname);

var OUTFILE = path.join(BASEPATH, "out.txt")

var args = require("minimist")( process.argv.slice(2), {
    boolean: [ "help", "in", "out", "compress"],
    string: [ "file" ]
});
if(args.help) {
    printHelp();
} else if(
    args.in ||
    args._.includes("-")
) {
    processFile(process.stdin)
} else if(args.file) {
    let stream = fs.createReadStream(path.join(BASEPATH, args.file));
    processFile(stream);
} else {
    error("Incorrect usage.", true);
}


function processFile(inStream) {
    var outStream = inStream;
    var upperStream = new Transform({
        transform(chunk, enc, cb) {
            this.push(chunk.toString().toUpperCase());
            cb();
        }
    });

    outStream = outStream.pipe(upperStream);

    if(args.compress) {
        let gzipStream = zlib.createGzip();
        outStream = outStream.pipe(gzipStream);
        OUTFILE = `${OUTFILE}.gz`
    }

    var targetStream 
    if(args.out) {
        targetStream = process.stdout
    } else {
        targetStream = fs.createWriteStream(OUTFILE);
    }

    outStream.pipe(targetStream);
}

function error(msg, includeHelp = false) {
    console.error(msg);
    if(includeHelp) {
        console.log("");
        printHelp();
    }
}

//*******************
function printHelp() {
    console.log("ex1 usage");
    console.log("ex1.js --help");
    console.log("");
    console.log("--help             print this help");
    console.log("--file={FILENAME}  print file name");
    console.log("")
}