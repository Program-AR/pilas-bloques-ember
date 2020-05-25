import { download } from '../utils/FileDownload';
import PilasBloquesLevelEncoder from "./PilasBloquesLevelEncoder";

export default levelToDownload => {
  let encodedLevel;
  try {
    encodedLevel = new PilasBloquesLevelEncoder().encode(levelToDownload);
  } catch (e) {//TODO preferible generar un archivo erróneo que explotar
    encodedLevel = levelToDownload;
  }
  const opaqueEncodedLevel = btoa(JSON.stringify(encodedLevel));
  download(`${levelToDownload.name}.pb`, opaqueEncodedLevel);
};