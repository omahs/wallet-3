export const navigate = jest.fn()
export const navigateClearingStack = jest.fn()
export const replace = jest.fn()
export const navigateHome = jest.fn()
export const popToScreen = jest.fn()
export const navigateBack = jest.fn()
export const ensurePincode = jest.fn()
export const isBottomSheetVisible = jest.fn()
export const navigateHomeAndThenToScreen = jest.fn()

export enum NavActions {
  SET_NAVIGATOR = 'NAVIGATION/SET_NAVIGATOR',
}
