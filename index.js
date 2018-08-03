/**
 * The create react app env loader, based on the logic from Ruby's dotenv
 * with tweaks from Remy Sharp to make it into a single module
 */

/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

const fs = require('fs');
const path = require('path');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const dotenvPath = resolveApp('.env');

let NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  NODE_ENV = process.env.NODE_ENV = 'development';
  // console.warn('NODE_ENV set to default "development" value');
}

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
var dotenvFiles = [
  `${dotenvPath}.${NODE_ENV}.local`,
  `${dotenvPath}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && `${dotenvPath}.local`,
  dotenvPath,
].filter(Boolean);

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv

const hasExample = fs.existsSync(`${dotenvPath}.example`);

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    const dotenvExpand = require('dotenv-expand');
    const config = {
      path: dotenvFile,
    };

    if (hasExample) {
      try {
        require('dotenv-safe').config(config);
      } catch (e) {
        e.message =
          e.message
            .replace(/If you expect any of these variables(?:.|\s)+$/im, '')
            .trim() + '\n';
        throw e;
      }
    } else {
      require('dotenv').config(config);
    }

    if (!process.env.NO_EXPAND) dotenvExpand({ parsed: process.env });
  }
});

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
process.env.NODE_PATH = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

/**
 *
 * @param {RegExp*} filterRe for instance /^REACT_APP_/i
 * @param {Object*} extend optional additional env values to return
 */
function getClientEnvironment(filterRe, extend) {
  const raw = Object.keys(process.env)
    .filter(key => !filterRe || filterRe.test(key))
    .reduce((env, key) => {
      env[key] = process.env[key];
      return env;
    }, extend || {});
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
