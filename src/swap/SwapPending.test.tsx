import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { Provider } from 'react-redux'
import { navigate } from 'src/navigator/NavigationService'
import { Screens } from 'src/navigator/Screens'
import { swapReset, SwapState } from 'src/swap/slice'
import SwapPending from 'src/swap/SwapPending'
import { createMockStore } from 'test/utils'

describe('SwapPending', () => {
  describe('Swap.START', () => {
    const store = createMockStore({
      swap: {
        swapState: SwapState.START,
      },
    })

    it('should display correctly if swap state is Swap.START', () => {
      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )
      expect(getByTestId('SwapPending/loadingIcon')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapPending')).toBeTruthy()
      expect(getByText('swapCompleteScreen.exchangeRateSubtext')).toBeTruthy()
    })
  })

  describe('Swap.APPROVE', () => {
    const store = createMockStore({
      swap: {
        swapState: SwapState.APPROVE,
      },
    })

    it('should display correctly if swap state is Swap.APPROVE', () => {
      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )
      expect(getByTestId('SwapPending/loadingIcon')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapPending')).toBeTruthy()
      expect(getByText('swapCompleteScreen.approvingSubtext')).toBeTruthy()
    })
  })

  describe('Swap.EXECUTE', () => {
    it('should display correctly if swap state is Swap.EXECUTE', () => {
      const store = createMockStore({
        swap: {
          swapState: SwapState.EXECUTE,
        },
      })
      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )
      expect(getByTestId('SwapPending/loadingIcon')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapPending')).toBeTruthy()
      expect(getByText('swapCompleteScreen.completingSubtext')).toBeTruthy()
    })
  })

  describe('Swap.ERROR', () => {
    it('should display correctly if swap state is Swap.ERROR', () => {
      const store = createMockStore({
        swap: {
          swapState: SwapState.ERROR,
        },
      })
      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )

      expect(getByText('swapCompleteScreen.swapErrorModal.title')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapErrorModal.swapRestart')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapErrorModal.contactSupport')).toBeTruthy()
      expect(getByTestId('ErrorModal')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapErrorModal.body')).toBeTruthy()
      expect(getByTestId('SwapPending/errorIcon')).toBeTruthy()
    })

    it('should be able to navigate to swap start', () => {
      const store = createMockStore({
        swap: {
          swapState: SwapState.ERROR,
        },
      })
      store.dispatch = jest.fn()
      const { getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )

      fireEvent.press(getByText('swapCompleteScreen.swapErrorModal.swapRestart'))
      expect(store.dispatch).toHaveBeenCalledWith(swapReset())
      expect(navigate).toHaveBeenCalledWith(Screens.SwapScreen)
    })

    it('should be able to navigate to contact support', () => {
      const store = createMockStore({
        swap: {
          swapState: SwapState.ERROR,
        },
      })
      store.dispatch = jest.fn()
      const { getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )

      fireEvent.press(getByText('swapCompleteScreen.swapErrorModal.contactSupport'))
      expect(store.dispatch).toHaveBeenCalledWith(swapReset())
      expect(navigate).toHaveBeenCalledWith(Screens.SwapScreen)
      expect(navigate).toHaveBeenCalledWith(Screens.SupportContact)
    })
  })

  describe('Swap.PRICE_CHANGE', () => {
    it('should display correctly if swap state is Swap.PRICE_CHANGE', () => {
      const store = createMockStore({
        swap: {
          swapState: SwapState.PRICE_CHANGE,
        },
      })
      const { getByTestId, getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )
      expect(getByText('swapCompleteScreen.swapPriceModal.title')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapPriceModal.action')).toBeTruthy()
      expect(getByTestId('PriceChangeModal')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapPriceModal.body')).toBeTruthy()
      expect(getByTestId('SwapPending/errorIcon')).toBeTruthy()
    })

    it('should navigate to swap review on modal dismiss', () => {
      const store = createMockStore({
        swap: {
          swapState: SwapState.PRICE_CHANGE,
        },
      })
      const { getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )
      fireEvent.press(getByText('swapCompleteScreen.swapPriceModal.action'))
      expect(navigate).toHaveBeenCalledWith(Screens.SwapReviewScreen)
    })
  })

  describe('SWAP.COMPLETE', () => {
    it('should display correctly if swap state is SWAP.COMPLETE', () => {
      const store = createMockStore({
        swap: {
          swapState: SwapState.COMPLETE,
        },
      })
      const { getByText } = render(
        <Provider store={store}>
          <SwapPending />
        </Provider>
      )
      expect(getByText('swapCompleteScreen.swapSuccess')).toBeTruthy()
      expect(getByText('swapCompleteScreen.swapAgain')).toBeTruthy()
    })
  })

  it("should be able to navigate swap start to on press of 'Swap Again'", () => {
    const store = createMockStore({
      swap: {
        swapState: SwapState.COMPLETE,
      },
    })
    store.dispatch = jest.fn()
    const { getByText } = render(
      <Provider store={store}>
        <SwapPending />
      </Provider>
    )
    fireEvent.press(getByText('swapCompleteScreen.swapAgain'))
    expect(store.dispatch).toHaveBeenCalledWith(swapReset())
    expect(navigate).toHaveBeenCalledWith(Screens.SwapScreen)
  })
})
