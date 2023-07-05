import { Configuration, build } from 'electron-builder';
import 'dotenv/config';

const config: Configuration = {
  appId: process.env.APP_ID,
  productName: process.env.PRODUCT_NAME,
  icon: process.env.ICON,
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
    icon: process.env.ICON,
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
    uninstallDisplayName: `${process.env.PRODUCT_NAME} Uninstaller`,
    artifactName: `${process.env.PRODUCT_NAME}_Windows.exe`,
  },
  mac: {
    icon: process.env.ICON,
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
    notarize: false,
    artifactName: `${process.env.PRODUCT_NAME}_Mac.dmg`,
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
  afterSign: 'src/notarize.js',
};

build({ config });
