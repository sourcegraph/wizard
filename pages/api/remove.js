const os = require('os');
const home = os.homedir();

// Check if frontend is ready
export default function handler(req, res) {
  // POST request only
  if (req.method === 'GET') {
    return res.status(400).json({ Error: 'Method not allowed.' });
  }
  try {
    console.log('Removing Setup Wizard from VM...');
    spawn('bash', [`${home}/wizard/scripts/remove.sh`]);
    return res.status(200).json('Removed');
  } catch (error) {
    return res.status(400).json('Failed to remove');
  }
}
