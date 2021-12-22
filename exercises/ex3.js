#!/usr/bin/env node

"use strict";

var util = require("util");
var path = require("path");
var fs = require("fs");
var Transform = require("stream").Transform;
var zlib = require("zlib");

var CAF = require("caf");

const BASEPATH =
path.resolve(process.env.BASEPATH || __dirname);

var OUTFILE = path.join(BASEPATH, "out.txt")

var args = require("minimist")( process.argv.slice(2), {
    boolean: [ "help", "in", "out", "compress"],
    string: [ "file" ]
});

processFile = CAF(processFile);


function streamComplete(stream) {
    return new Promise(function c(res) {
        stream.on("end", res);
    });
}

if(args.help) {
    printHelp();
} else if(
    args.in ||
    args._.includes("-")
) {
    let tooLong = CAF.timeout(20, "Took too long!");

    processFile(tooLong, process.stdin)
    .catch(error);
} else if(args.file) {
    let stream = fs.createReadStream(path.join(BASEPATH, args.file));

    let tooLong = CAF.timeout(20, "Took too long!");

    processFile(tooLong, stream)
    .then(function(){
        console.log("complete");
    })
    .catch(error);
} else {
    error("Incorrect usage.", true);
}


function *processFile(signal, inStream) {
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
    
    signal.pr.catch(function f(){
        outStream.unpipe(targetStream);
        outStream.destroy();
    });

    yield streamComplete(outStream);
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