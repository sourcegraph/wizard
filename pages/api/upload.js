const { writeFile } = require('fs');
let multiparty = require('multiparty');
const os = require('os');
const home = os.homedir();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(400).json({ Error: 'Method not allowed.' });
  }
  try {
    console.log('Uploading...');
    const form = new multiparty.Form();
    const data = await new Promise((resolve, reject) => {
      form.parse(req, function (err, fields, files) {
        if (err) reject({ err });
        resolve({ fields, files });
      });
    });
    const fileData = data.fields.file[0];
    const fileName = data.fields.fileName[0];
    writeFile(`${home}/.ssh/${fileName}`, fileData, function (err, data) {
      if (err) throw err;
      return res.status(200).json({ body: 'Uploaded successfully' });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json('Failed');
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
