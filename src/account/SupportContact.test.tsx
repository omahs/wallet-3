import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import 'react-native'
import Mailer from 'react-native-mail'
import { Provider } from 'react-redux'
import SupportContact from 'src/account/SupportContact'
import { APP_NAME, CELO_SUPPORT_EMAIL_ADDRESS } from 'src/brandingConfig'
import i18n from 'src/i18n'
import { Screens } from 'src/navigator/Screens'
import Logger from 'src/utils/Logger'
import { createMockStore, flushMicrotasksQueue, getMockStackScreenProps } from 'test/utils'

const mockScreenProps = getMockStackScreenProps(Screens.SupportContact)

describe('Contact', () => {
  it('renders correctly', () => {
    const tree = render(
      <Provider store={createMockStore({})}>
        <SupportContact {...mockScreenProps} />
      </Provider>
    )
    expect(tree).toMatchSnapshot()
  })

  it('submits email with logs', async () => {
    const mockedLogAttachments = Logger.getLogsToAttach as jest.Mock
    Logger.getCurrentLogFileName = jest.fn(() => 'log2.txt')
    const logAttachments = [
      {
        path: 'logs/log1.txt',
        type: 'text',
        name: 'log1.txt',
      },
      {
        path: 'logs/log2.txt',
        type: 'text',
        name: 'log2.txt',
      },
    ]
    mockedLogAttachments.mockResolvedValue(logAttachments)

    const { getByTestId } = render(
      <Provider store={createMockStore({})}>
        <SupportContact {...mockScreenProps} />
      </Provider>
    )
    // Text is required to send to support
    fireEvent.changeText(getByTestId('MessageEntry'), 'Test Message')
    fireEvent.press(getByTestId('SubmitContactForm'))

    await flushMicrotasksQueue()

    expect(Mailer.mail).toBeCalledWith(
      expect.objectContaining({
        isHTML: true,
        body: 'Test Message<br/><br/><b>{"version":"0.0.1","buildNumber":"1","apiLevel":-1,"country":"US","region":null,"deviceId":"someDeviceId","deviceBrand":"someBrand","deviceModel":"someModel","address":"0x0000000000000000000000000000000000007e57","sessionId":"","numberVerifiedCentralized":false,"network":"alfajores"}</b><br/><br/><b>Support logs are attached...</b>',
        recipients: [CELO_SUPPORT_EMAIL_ADDRESS],
        subject: i18n.t('supportEmailSubject', { appName: APP_NAME, user: '+1415555XXXX' }),
        attachments: logAttachments,
      }),
      expect.any(Function)
    )
  })
})
