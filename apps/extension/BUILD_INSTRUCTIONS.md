## Build

1. **Version Bump:**
   - Bump current version in `package.json`

2. **Set Environment Variables:**
   - `$env:NODE_ENV="production"`
   - `$env:BACKEND_URL="https://web-to-mcp.com"`

3. **Install Dependencies:**
   - Run `npm install` to ensure all dependencies are up to date

4. **Build Extension:**
   - Run `npm run build` to create the production build

5. **Create Zip Package:**
   - Run `npm run zip` to create a zip file ready for Chrome Web Store
   - The zip file will be placed in the `output` directory

## Prerequisites

- Node.js installed on your system
- npm package manager
- Windows operating system

## Output

After successful execution, you'll find the packaged extension in the `output` directory. The zip file can be directly uploaded to the Chrome Web Store Developer Dashboard.

## Environment Variables

The scripts set the following environment variables:
- `NODE_ENV`: Set to "production" for optimized builds
- `BACKEND_URL`: Set to the production backend URL (configurable in PowerShell script)

These variables are used by the WXT build process to configure the extension for production use. 