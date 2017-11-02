#!/usr/bin/env node

if (process.env.NODE_ENV.indexOf('development') > -1) {
  require('babel-register');
  require('../src/cli');
} else {
  require('../lib/cli');
}
