#!/usr/bin/env node
'use strict';

let command;

if (process.argv[1] && process.argv[1].includes('.bin/update')) {
	command = require('./lib/update');
} else {
	command = require('./lib/tests');
}

command.handle();
