const fs = require('fs');
const path = require('path');
const config = require('../config/bot');

const getDirectories = (source) => fs.readdirSync(source, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const requireCommandOptions = (requirePath) => {
  const options = {};
  const dirents = fs.readdirSync(requirePath, { withFileTypes: true });
  dirents.forEach((dir) => {
    if (dir.isFile()) {
      const innerPath = path.join(requirePath, dir.name);
      const [modulename, extension] = dir.name.split('.');
      if (extension === 'js') {
        const inner = require(innerPath);
        const commandOptions = inner.options(config.env.discord.prefix);
        if (modulename === 'index') {
          const wrapperCommand = requirePath.split(path.sep).pop();
          options[wrapperCommand] = commandOptions;
          options[wrapperCommand].isWrapper = true;
          options[wrapperCommand].subCommands = requireCommandOptions(path.join(requirePath, 'sub'));
        } else {
          options[modulename] = commandOptions;
        }
      }
    }
  });

  return options;
};

const getCommandsOptions = () => {
  let options = {};
  const directories = getDirectories(__dirname);
  directories.forEach((subDirName) => {
    const fullPath = path.join(__dirname, subDirName);
    const commandOptions = requireCommandOptions(fullPath);
    options = { ...options, ...commandOptions };
  });

  return options;
};

module.exports = {
  commands: getCommandsOptions(),
};
