import { spawn } from 'typed-redux-saga'
import { Actions } from 'src/goldToken/actions'
import { tokenTransferFactory } from 'src/tokens/saga'

const tag = 'goldToken/saga'

export const goldTransferLegacy = tokenTransferFactory({
  actionName: Actions.TRANSFER,
  tag,
})

export function* goldTokenSaga() {
  yield* spawn(goldTransferLegacy)
}
