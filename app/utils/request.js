export const badRequest = (cb) => ({ status }) => {
  if (status === 400) cb()
}
export const notFound = (cb) => ({ status }) => {
  if (status === 404) cb()
}
