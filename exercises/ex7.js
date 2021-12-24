#!/usr/bin/env node

"use strict";

var util = require("util");
var childProc = require("child_process");



// ************************************

const HTTP_PORT = 8039;
const MAX_CHILDREN = 1500;

var delay = util.promisify(setTimeout);


main().catch(console.error);


// ************************************

async function main() {
	console.log(`Load testing http://localhost:${HTTP_PORT}...`);


	while(true) {
		process.stdout.write(`Trying ${MAX_CHILDREN} requests...`);

		let children = [];

		for(let i=0; i < MAX_CHILDREN; i++) {
			let child = childProc.spawn("node", [ "ex7-child.js" ]);
			children.push(child);
		}

		let resps = children.map(function wait(child){
			return new Promise(function c(res){
				child.on("exit",function onExit(code){
					if (code === 0) res(true);
					res(false);
				});
			});
		});

		resps = await Promise.all(resps);

		if (resps.every(Boolean)) {
			console.log(" success!");
		}
		else {
			console.log(" failures.");
		}

		await delay(500);
	}
}
