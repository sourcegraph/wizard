import { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
export default function Home() {
  const [hostname, setHostname] = useState(null);
  const [size, setSize] = useState('XS');
  const [mode, setMode] = useState('new');
  const [version, setVersion] = useState('');
  const [fileName, setFileName] = useState(null);
  const [blob, setBlob] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [showErrors, setShowErrors] = useState(null);
  const [currentStatus, setCurrentStatus] = useState(null);
  const port = '30080';
  function teardownWizard(hostname) {
    fetch(`http://${hostname}:${port}/api/remove`)
      .then((res) => res.json())
      .catch((error) => console.log(error));
    setTimeout(() => {
      window.location.replace(`http://${hostname}/site-admin/init`);
    }, '5000');
  }

  function makeRequest(method, body) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    return {
      method: method,
      header: headers,
      body: body,
    };
  }

  useEffect(() => {
    if (!hostname) {
      const uri = new URL(window.location.origin);
      setHostname(uri.hostname);
    }
    if (blob && fileName) {
      setUploadStatus({
        [fileName]: 'Uploading',
      });
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('fileName', fileName);
      const postRequest = makeRequest('POST', formData);
      try {
        fetch(`http://${hostname}:${port}/api/upload`, postRequest)
          .then((res) => res.json())
          .then((res) => {
            console.log(res);
            setUploadStatus({
              [fileName]: res.body,
            });
          })
          .catch((error) => {
            throw error;
          });
      } catch (error) {
        setShowErrors(error);
        setUploadStatus({
          [fileName]: 'Failed',
        });
      }
    }
  }, [blob, fileName, hostname, port]);

  const onFileChange = useCallback(async (file, uploadName) => {
    const reader = new FileReader();
    reader.onloadstart = () =>
      setUploadStatus({
        [uploadName]: 'loading',
      });
    reader.onload = (event) => setBlob(event.target.result);
    const getFileName = await file.name;
    if (uploadName !== getFileName) {
      setUploadStatus({
        [uploadName]: `Failed: file name must be ${uploadName}`,
      });
    } else {
      setFileName(uploadName || getFileName);
      reader.readAsText(file, 'UTF-8');
    }
  }, []);

  const onLaunchClick = useCallback(
    (e) => {
      e.preventDefault();
      setSubmitted(true);
      const requestBody = {
        size: size,
        version: version,
      };
      const postRequest = makeRequest('POST', JSON.stringify(requestBody));
      function checkFrontend(tries) {
        if (tries > 0) {
          setCurrentStatus('Checking if frontend is ready...');
          fetch(`http://${hostname}:${port}/api/check`)
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if (res === 'Ready') {
                teardownWizard(hostname);
              } else {
                setTimeout(() => {
                  tries--;
                  checkFrontend(tries);
                }, '10000');
              }
            })
            .catch((error) => {
              console.error(error);
              throw error;
            });
        }
      }
      // Launch as new instance or upgrade
      try {
        fetch(`http://${hostname}:${port}/api/${mode}`, postRequest)
          .then((res) => {
            setCurrentStatus('Instance has been launched...');
            checkFrontend(20);
            setSubmitted(true);
            const responseText = res.toString();
            if (responseText === 'Failed') {
              setShowErrors(res);
              setSubmitted(false);
            }
          })
          .catch((error) => {
            throw new Error(error);
          });
      } catch (error) {
        setSubmitted(false);
        setShowErrors(error);
      }
    },
    [hostname, mode, size, version]
  );

  return (
    <div className="container" role="main">
      <Head>
        <title>Sourcegraph Setup Wizard</title>
        <meta name="description" content="Set up a Sourcegraph instance" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="homepage">
        <img alt="sourcegraph logo" src="/logo.svg" className="logo-big" />
        <h1>Sourcegraph Image Instance Setup Wizard</h1>
        {submitted ? (
          <div className="loading">
            <div className="settings">
              <div className="loading-zone">
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
                <span className="loading-dot"></span>
              </div>
              <h4>Your instance is being set up...</h4>
              <h4>{currentStatus}</h4>
              <h5>You will be redirected to the login page automatically.</h5>
            </div>
          </div>
        ) : (
          <div className="settings">
            <label>
              <h4 className="subtitle">Select your instance size*</h4>
              <select
                onChange={(e) => setSize(e.target.value)}
                className="input"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </label>
            <label>
              <h4 className="subtitle">Select instance launch mode*</h4>
              <select
                onChange={(e) => setMode(e.target.value)}
                className="input"
              >
                <option value="new">New - Launch a new instance</option>
                <option value="upgrade">
                  Upgrade - Upgrade existing instance
                </option>
              </select>
            </label>
            {mode === 'upgrade' ? (
              <label>
                <h4 className="subtitle">Enter a version number for upgrade</h4>
                <input
                  type="text"
                  onChange={(e) => setVersion(e.target.value)}
                  className="input"
                  placeholder="Example: 4.1.3"
                />
              </label>
            ) : (
              <label className="file">
                <h4 className="subtitle">
                  Optional: Code host SSH file - id_rsa
                </h4>
                <h5 className="error">
                  {uploadStatus &&
                    uploadStatus.id_rsa &&
                    'Status: ' + uploadStatus.id_rsa}
                </h5>
                <input
                  className=""
                  name="id_rsa"
                  type="file"
                  onChange={(e) =>
                    onFileChange(e.target.files[0], e.target.name)
                  }
                />
                <h4 className="subtitle">
                  Optional: Code host SSH file - known_hosts
                </h4>
                <h5 className="error">
                  {uploadStatus &&
                    uploadStatus.known_hosts &&
                    'Status: ' + uploadStatus.known_hosts}
                </h5>
                <input
                  className=""
                  name="known_hosts"
                  type="file"
                  onChange={(e) =>
                    onFileChange(e.target.files[0], e.target.name)
                  }
                />
              </label>
            )}
            {showErrors && <h5 className="error">ERROR: {showErrors}</h5>}
            <div className="m-5">
              <input
                className="btn-next"
                type="button"
                value={submitted ? 'LOADING' : 'LAUNCH'}
                disabled={submitted}
                onClick={(e) => onLaunchClick(e)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
