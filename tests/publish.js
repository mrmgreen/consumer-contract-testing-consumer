const path = require('path');
const pact = require('@pact-foundation/pact-node')
const fs = require('fs');

function setAbsolutePath(filePath) {
  return path.resolve(__dirname, `../pacts/${filePath}`)
}

const jsonFiles = fs.readdirSync(path.resolve(__dirname, '../pacts'))
  .map(setAbsolutePath);

console.log('publishing files: ', jsonFiles);

const opts = {
  pactFilesOrDirs: jsonFiles,
  pactBroker: 'http://localhost',
  consumerVersion: '1.0.1'
}

pact.publishPacts(opts)
  .then(_ => console.log('Pact publishing was successful'))
  .catch(e => console.log('Pact publishing was unsuccessful. Error: ', e));