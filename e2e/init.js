import { launchApp } from './src/utils/retries'

beforeAll(async () => {
  // Install app if not present
  await device.installApp()
  await launchApp({
    newInstance: false,
    permissions: { notifications: 'YES', contacts: 'YES', camera: 'YES' },
    launchArgs: {
      language: 'en-US',
    },
  })
})
