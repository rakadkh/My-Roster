'use strict';

const fs = require('fs');
const git = require('simple-git/promise');

const { die, getRepoName } = require('./core/helpers');
const {
	TESTS_FOLDER,
	TESTS_REPO,
	DEFAULT_COMMIT_MESSAGE,
	UPDATE_SUCCEEDED,
	UPDATE_FAILED,
	UPDATE_CLEAN
} = require('./core/consts');

// get commit message if supplied, or return the default message
const getCommitMessage = () => {
	const argPosition = process.argv.indexOf('-m');

	if (argPosition < 0) {
		return DEFAULT_COMMIT_MESSAGE;
	}

	return process.argv[argPosition + 1];
};

// init the repo in the tests folder, and checkout a new branch
const createNewBranch = async repo => {
	await repo.init();
	await repo.addRemote('origin', TESTS_REPO);
	await repo.fetch();
	await repo.checkoutLocalBranch(getRepoName());
};

// push the changes in the tests to the remote repository
const pushChanges = async repo => {
	await repo.add('.');
	await repo.commit(getCommitMessage());
	await repo.push(['-u', 'origin', getRepoName()]);
};

// add-commit-push changes in .hg folder
const handle = async () => {
	if (!fs.existsSync(TESTS_FOLDER)) {
		die(UPDATE_FAILED);
	}

	const repo = git(TESTS_FOLDER);

	if (!fs.existsSync(`${TESTS_FOLDER}/.git`)) {
		await createNewBranch(repo);
	}

	if ((await repo.status()).isClean()) {
		console.log(UPDATE_CLEAN);
		return;
	}

	await pushChanges(repo);

	console.log(UPDATE_SUCCEEDED);
};

module.exports = {
	handle
};
