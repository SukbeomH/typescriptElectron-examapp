const { build } = require('electron-builder');
require('dotenv').config()

const config = {
  appId: process.env.APP_ID,
  productName: process.env.PLATFORM,
  icon: './image/' + process.env.PLATFORM + '.png',
  buildVersion: process.env.BUILD_VERSION,
  directories: {
    output: 'dist',
    buildResources: 'typescript',
  },
  extends: null,
  files: [
    'node_modules/**/*',
    {
      from: 'typescript',
      to: 'typescript',
      filter: '**/*',
    },
  ],
  asar: true,
  win: {
    icon: './image/' + process.env.PLATFORM + '.png',
    target: {
      target: 'nsis',
      arch: ['x64'],
    },
    certificateFile: process.env.CERTIFICATE_FILE,
    certificatePassword: process.env.CERTIFICATE_PASSWORD,
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    perMachine: true,
    deleteAppDataOnUninstall: true,
    createDesktopShortcut: true,
    warningsAsErrors: false,
    uninstallDisplayName: `${process.env.PLATFORM} Uninstaller`,
    artifactName: `${process.env.PLATFORM}_Windows.exe`,
  },
  mac: {
    // icon: '../image/' + process.env.PLATFORM + '.png',
    icon: './image/' + process.env.PLATFORM + '.png',
    target: {
      target: 'default',
      arch: ['x64', 'arm64'],
    },
    category: 'public.app-category.education',
    type: 'distribution',
    minimumSystemVersion: '10.12',
    hardenedRuntime: true,
    entitlements: 'entitlements.mac.plist',
    gatekeeperAssess: false,
    artifactName: `${process.env.PLATFORM}.dmg`,
    notarize: false,
  },
  dmg: {
    sign: false,
  },
  publish: [
    {
      provider: 'github',
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      token: process.env.GITHUB_TOKEN,
      releaseType: 'draft',
    },
  ],
};

build({ config });
