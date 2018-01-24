import { error } from './log';

const catchAPIError = (err, apiName) => {
  error(err);
  console.log('');
  error(`Oops, ${apiName} goes wrong.`);
  error(
    'Please run nba-go again.\nIf it still does not work, feel free to open an issue on https://github.com/xxhomey19/nba-go/issues'
  );
  process.exit(1);
};

export default catchAPIError;
