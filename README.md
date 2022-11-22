# Setup Wizard for Sourcegraph Machine Images

A start up screen that allows users to set up their Sourcegraph instance from UI when launching instances from a machine image.

Node.js version of https://github.com/sourcegraph/SetupWizard

## Development

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:30080](http://localhost:30080) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:30080/api/upgrade](http://localhost:30080/api/upgrade). This endpoint can be edited in `pages/api/upgrade.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
