// helper functions that default to false, but allows testing by mocking

// TODO(ACT-771): remove when status taken from statsig
export const getKeylessBackupGate = () => false

// TODO(ACT-684, ACT-766, ACT-767): remove when status taken from redux
export const isBackupComplete = () => false