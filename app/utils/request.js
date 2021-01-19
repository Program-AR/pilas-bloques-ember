export const badRequest = (cb) => ({ status }) => {
  if (status === 400) cb()
}
