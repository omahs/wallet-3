import Clipboard from '@react-native-clipboard/clipboard'
import { fireEvent, render } from '@testing-library/react-native'
import * as React from 'react'
import { Provider } from 'react-redux'
import QRCode from 'src/qrcode/QRCode'
import { createMockStore } from 'test/utils'
import { mockExchanges } from 'test/values'

jest.mock('@react-native-clipboard/clipboard', () => ({
  setString: jest.fn(),
}))

const mockStore = createMockStore({
  web3: {
    account: '0x0000',
  },
  account: {
    name: 'username',
  },
})

function getProps() {
  return {
    qrSvgRef: jest.fn() as any,
    exchanges: mockExchanges,
    onCloseBottomSheet: jest.fn(),
    onPressCopy: jest.fn(),
    onPressInfo: jest.fn(),
    onPressExchange: jest.fn(),
  }
}

describe('ExchangeQR', () => {
  beforeEach(() => {
    mockStore.dispatch = jest.fn()
    jest.clearAllMocks()
  })

  it('displays QR code, name, and address', () => {
    const { queryByTestId } = render(
      <Provider store={mockStore}>
        <QRCode {...getProps()} />
      </Provider>
    )
    expect(queryByTestId('styledQRCode')).toBeTruthy()
    expect(queryByTestId('displayName')).toBeTruthy()
    expect(queryByTestId('address')).toBeTruthy()
  })

  it('does not display name when it has not been set', () => {
    const store = createMockStore({
      web3: {
        account: '0x000',
      },
      account: {
        name: undefined,
      },
    })
    store.dispatch = jest.fn()
    const { queryByTestId } = render(
      <Provider store={store}>
        <QRCode {...getProps()} />
      </Provider>
    )
    expect(queryByTestId('displayName')).toBeFalsy()
  })

  it('copies address when copy button pressed', async () => {
    const props = getProps()
    const { queryByTestId, getByTestId } = render(
      <Provider store={mockStore}>
        <QRCode {...props} />
      </Provider>
    )

    expect(queryByTestId('copyButton')).toBeTruthy()
    await fireEvent.press(getByTestId('copyButton'))
    expect(props.onPressCopy).toHaveBeenCalledTimes(1)
    expect(Clipboard.setString).toHaveBeenCalledWith('0x0000')
  })
})
