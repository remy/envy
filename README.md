# envy

The [create-react-app](https://github.com/facebookincubator/create-react-app) environment loader for consistent reuse in other projects with additions for command line usage.

**Important:** envy will default to `NODE_ENV=development` if there is no value on `NODE_ENV`.

## Installation

```shell
npm install --save @remy/envy
```

## Typical usage

```js
// populates process.env
require('@remy/envy'); // do this as early as possible in the code

// Also populate and return
const { raw, stringified } = require('@remy/envy');
```

<details><summary>What `.env` files can be used?</summary>

* `.env`: Default.
* `.env.local`: Local overrides. **This file is loaded for all environments except test.**
* `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
* `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

Files on the left have more priority than files on the right:

* `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
* `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
* `npm test`: `.env.test.local`, `.env.test`, `.env` (note `.env.local` is missing)

These variables will act as the defaults if the machine does not explicitly set them.

Please refer to the [dotenv documentation](https://github.com/motdotla/dotenv) for more details.

>Note: If you are defining environment variables for development, your CI and/or hosting platform will most likely need
these defined as well. Consult their documentation how to do this. For example, see the documentation for [Travis CI](https://docs.travis-ci.com/user/environment-variables/) or [Heroku](https://devcenter.heroku.com/articles/config-vars).

</details>

## CLI usage

Beyond using the package as a dependency, a CLI utility is provided for testing environment values and _also_ injecting the environment variables into a command.

Assuming the package was installed locally to your project, and using [npx](https://www.npmjs.com/package/npx) to run a `.bin` command:

```shell
$ NODE_ENV=test npx envy
> # prints entire environment loaded

$ NODE_ENV=test npx envy NODE_ENV
> test

$ NODE_ENV=test npx envy -- node -e "console.log(process.env.NODE_ENV)"
> test
```

### `--` Double dash to signify the end of the options

When passing `--` to `envy` everything afterwards will be executed with the modified environment (a bit like the `foreman` command line too).
