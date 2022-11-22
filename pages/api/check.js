const os = require('os');
const home = os.homedir();
// Check if frontend is ready
export default function handler(req, res) {
  // POST request only
  if (req.method === 'GET') {
    return res.status(400).json({ Error: 'Method not allowed.' });
  }
  try {
    console.log('Checking if frontend is ready');
    const response = execSync(
      `bash ${home}/wizard/scripts/frontend.sh`
    ).toString();
    if (response.startsWith('Ready')) {
      return res.status(200).json('Ready');
    } else {
      return res.status(200).json('Retrying in a few...');
    }
  } catch (error) {
    return res.status(400).json('Failed to connect to frontend');
  }
}
