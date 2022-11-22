const { copyFileSync, writeFile } = require('fs');
const { execSync } = require('child_process');
const os = require('os');
const home = os.homedir();

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(400).json({ Error: 'Method not allowed.' });
  }
  const queries = req.body;
  const size = queries.size || 'XS';
  const version = queries.version || '';
  // Save size to root disk
  writeFile(`${home}/.sourcegraph-size`, size);
  // Save version to root disk
  writeFile(`${home}/.sourcegraph-version`, version);
  // Configure override file
  copyFileSync(
    `${home}/deploy/install/override.${size}.yaml`,
    `${home}/deploy/install/override.yaml`
  );
  console.log('Running upgrade script for size ', size);
  const response = execSync(
    `bash ${home}/wizard/scripts/upgrade.sh`
  ).toString();
  if (response.startsWith('Done')) {
    return res.status(200).json('Passed');
  } else {
    return res.status(400).json('Upgrade Failed: No upgrade for new instance');
  }
}
