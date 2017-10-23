/**
 * Copyright 2017-present, Callstack.
 * All rights reserved.
 *
 * @flow
 */

const path = require('path');

const handleMultipleEntries = (multiEntry: *) => {
  if (Array.isArray(multiEntry)) {
    return (
      multiEntry
        // Don't use first entry as this is our polyfill
        .slice(1)
        .map(entry => path.resolve(process.cwd(), entry))
    );
  }
  if (typeof multiEntry === 'object') {
    const entryKeys = Object.keys(multiEntry);
    return entryKeys.reduce((fileArray, key) => {
      const entry = multiEntry[key];
      if (typeof entry === 'string') {
        fileArray.push(entry);
        return fileArray;
      }

      const tempArr = entry
        // Don't use first entry as this is our polyfill
        .slice(1)
        .map((file: string) => path.resolve(process.cwd(), file));
      fileArray.push(`(chunk: ${key})`, ...tempArr);
      return fileArray;
    }, []);
  }

  return multiEntry;
};

function getEntryFiles(userEntry: *) {
  if (typeof userEntry === 'string') {
    return path.join(process.cwd(), userEntry);
  }
  if (Array.isArray(userEntry) || typeof userEntry === 'object') {
    return handleMultipleEntries(userEntry).join('\n');
  }

  return userEntry;
}

module.exports = getEntryFiles;
