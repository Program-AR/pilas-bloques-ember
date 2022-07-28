export const badRequest = (cb) => ({ status }) => {
  if (status === 400) cb()
}
export const notFound = (cb) => ({ status }) => {
  if (status === 404) cb()
}
export const unauthorized = (cb) => ({ status }) => {
  if (status === 401) cb()
}
export class HttpErrorHandler{
  constructor(response) {
    this.response = response
  }
  _callError(errorFunction){
    errorFunction(this.response);
    return new HttpErrorHandler(this.response)
  }
  badRequest(cb) {
    return this._callError(badRequest(cb))
  }
  unauthorized(cb) {
    return this._callError(unauthorized(cb))
  }
  notFound(cb) {
    return this._callError(notFound(cb))
  }
}

export const loadLazyScript = (file) => {
  //TODO: Use afterRender?
  setTimeout(() => {
    if (!document.getElementById(file)) { //TODO: Pensar mejor este if
      const _script = document.createElement('script')
      _script.type = 'text/javascript'
      _script.src = `assets/${file}`
      _script.id = file
      const _head = document.getElementsByTagName("head")[0]
      _head.appendChild(_script)
    }
  }, 1)
}
