const { copyFileSync, writeFile } = require('fs');
const os = require('os');
const home = os.homedir();

// Launch the instance with the configurations
export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(400).json({ Error: 'Method not allowed.' });
  }
  const uri = new URL(req.url);
  const size = uri.searchParams.get('size') || 'XS';
  // Configure override file
  copyFileSync(
    `${home}/deploy/install/override.${size}.yaml`,
    `${home}/deploy/install/override.yaml`
  );
  // Save size to root disk
  writeFile(`${home}/.sourcegraph-size`, size);
  console.log('Running launch script');
  const response = execSync(`bash ${home}/wizard/scripts/launch.sh`).toString();
  if (response) {
    return res.status(200).json('Passed');
  }
  return res.status(400).json('Failed');
}
