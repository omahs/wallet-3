import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getRehydratePayload, REHYDRATE, RehydrateAction } from 'src/redux/persist-helper'
import { SwapUserInput } from 'src/swap/types'

export enum SwapState {
  USER_INPUT = 'user-input',
  QUOTE = 'quote',
  START = 'start',
  APPROVE = 'approve',
  EXECUTE = 'execute',
  COMPLETE = 'complete',
  PRICE_CHANGE = 'price-change',
  ERROR = 'error',
}

export interface State {
  swapState: SwapState
  swapInfo: {} | null
  swapUserInput: SwapUserInput | null
}

const initialState: State = {
  swapState: SwapState.QUOTE,
  swapInfo: null,
  swapUserInput: null,
}

export const slice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    setSwapUserInput: (state, action: PayloadAction<SwapUserInput>) => {
      state.swapState = SwapState.USER_INPUT
      state.swapUserInput = action.payload
    },
    swapStart: (state, payload) => {
      state.swapState = SwapState.START
      state.swapInfo = payload
    },
    swapApprove: (state) => {
      state.swapState = SwapState.APPROVE
    },
    swapExecute: (state) => {
      state.swapState = SwapState.EXECUTE
    },
    swapSuccess: (state) => {
      state.swapState = SwapState.COMPLETE
      state.swapInfo = null
    },
    swapReset: (state) => {
      state.swapState = SwapState.USER_INPUT
      state.swapInfo = null
    },
    swapPriceChange: (state) => {
      state.swapState = SwapState.PRICE_CHANGE
    },
    swapError: (state) => {
      state.swapState = SwapState.ERROR
      state.swapInfo = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action: RehydrateAction) => ({
      ...state,
      ...getRehydratePayload(action, 'swap'),
      swapState: SwapState.QUOTE,
      swapInfo: null,
      swapUserInput: null,
    }))
  },
})

export const {
  setSwapUserInput,
  swapStart,
  swapApprove,
  swapExecute,
  swapSuccess,
  swapReset,
  swapPriceChange,
  swapError,
} = slice.actions

export default slice.reducer
