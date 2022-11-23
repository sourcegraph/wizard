const os = require('os');
const home = os.homedir();
const { execSync } = require('child_process');

// Check if frontend is ready
export default function handler(req, res) {
  try {
    console.log('Checking if frontend is ready');
    const response = execSync(`bash ${home}/wizard/scripts/frontend.sh`, {
      encoding: 'utf8',
    });
    console.log(response);
    if (response) {
      console.log('The frontend is ready.');
      return res.status(200).json('Ready');
    } else {
      return res.status(200).json('Retrying in a few...');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json('Failed to connect to frontend');
  }
}
