import { helper } from '@ember/component/helper';
import ENV from 'pilasbloques/config/environment'

function urlWithRoot(urlWithoutRoot) {
  return ENV.rootURL + urlWithoutRoot;
}

export default helper(urlWithRoot);