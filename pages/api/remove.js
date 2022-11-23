const os = require('os');
const home = os.homedir();
const { spawn } = require('child_process');

// Check if frontend is ready
export default function handler(req, res) {
  try {
    console.log('Removing Setup Wizard from VM...');
    const ls = spawn('bash', [`${home}/wizard/scripts/remove.sh`]);
    ls.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    ls.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    ls.on('close', (code) => {
      if (code === 0) {
        return res.status(200).json('Removed');
      }
    });
  } catch (error) {
    return res.status(400).json('Failed to remove');
  }
}
