'use strict';

const fs = require('fs');
const path = require('path');
const git = require('simple-git/promise');
const readdirp = require('readdirp');
const { runCLI } = require('jest');
const inquirer = require('inquirer');
// const inquirerAutocompletePrompt = require('inquirer-autocomplete-prompt');

const {
	die,
	humanizeTestName,
	isWindows,
	getRepoName
} = require('./core/helpers');
const {
	NO_TESTS,
	TESTS_FOLDER,
	TESTS_REPO,
	PROMPT_MESSAGE,
	PROMPT_CHOICE_ALL,
	INTERNAL_ERROR
} = require('./core/consts');

// hide 'Determining test suites to run...' message
process.env.TERM = 'dumb';

// show the prompt and execute the tests
const handle = async () => {
	await pullTestsRepo();

	const tests = (await readdirp.promise(TESTS_FOLDER)).filter(t =>
		t.path.endsWith('.test.js')
	);

	if (!tests.length) {
		die(NO_TESTS);
	}

	const testNames = tests.map(t => humanizeTestName(t.path));
	const selected = await selectTestPrompt(testNames);

	const testIndex = testNames.findIndex(t => t === selected);
	const selectedTestPath = testIndex >= 0 ? tests[testIndex].path : '';

	await runTest(selectedTestPath);
};

// update tests from the main tests repository
const pullTestsRepo = async () => {
	let repoName = getRepoName();

	if (fs.existsSync(TESTS_FOLDER) && (await git(TESTS_FOLDER).checkIsRepo())) {
		await git(TESTS_FOLDER).pull();
	} else {
		await git().clone(TESTS_REPO, TESTS_FOLDER, [`--branch=${repoName}`]);
	}
};

// run jest on the selected test/all
const runTest = async testPath => {
	if (isWindows) {
		testPath = testPath.replace('\\', '/');
	}

	const ex = `${TESTS_FOLDER}/${testPath}`;

	let testsToRun = [];

	if (fs.existsSync(ex)) {
		testsToRun.push(ex);
	}

	await runCLI(
		{
			_: testsToRun,
			verbose: false,
			silent: true,
			runInBand: process.argv.includes('--runInBand'),
			reporters: [path.join(__dirname, 'reporter.js')],
			projects: [path.resolve('./.hg')]
		},
		[path.resolve('./jest.config.js')]
	);
};

// function to resolve test results for the autocomplete
// const searchTest = testNames => {
// 	return (currentTestNames, input) => {
// 		const choices = [PROMPT_CHOICE_ALL, ...testNames];

// 		return new Promise((resolve, reject) => {
// 			if (!input) {
// 				resolve(choices);
// 			}

// 			resolve(
// 				choices.filter(c => c.toLowerCase().indexOf(input.toLowerCase()) >= 0)
// 			);
// 		});
// 	};
// };

// show promot to select a from the available tests
// const selectTestPrompt = async testNames => {
// 	inquirer.registerPrompt('autocomplete', inquirerAutocompletePrompt);

// 	const { selected } = await inquirer.prompt({
// 		type: 'autocomplete',
// 		name: 'selected',
// 		message: PROMPT_MESSAGE,
// 		source: searchTest(testNames)
// 	});

// 	return selected;
// };
const selectTestPrompt = async testNames => {
	// inquirer.registerPrompt('list', inquirerAutocompletePrompt);

	const { selected } = await inquirer.prompt({
		type: 'list',
		name: 'selected',
		message: PROMPT_MESSAGE,
		choices: [PROMPT_CHOICE_ALL, ...testNames]
	});

	return selected;
};

module.exports = {
	handle: async () => {
		try {
			await handle();
		} catch (err) {
			die(INTERNAL_ERROR);
		}
	}
};
