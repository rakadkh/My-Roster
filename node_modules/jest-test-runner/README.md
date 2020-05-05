## Instructions

1. Put the tests inside `.hg` folder in the exercises repo.
1. Add `.hg` to the `.gitignore`.
1. Use `npm run update` to update the tests in the remote repository of all of the tests.
   It will be commited using a default commit message. If you want to add your custom message, run the command just like that:
   ```bash
   npm run update -- -m "commit message"
   ```
1. In the lesson repository, add the following to the scripts:
   ```bash
   "tests": "tests",
   "update": "update"
   ```

## Running tests in band

In order to run tests in band (One by one), change the scripts to:

1. `"test-silent": "jest --runInBand || exit 0"`
1. `"tests": "tests --runInBand"`
