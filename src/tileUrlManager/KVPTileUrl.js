import { TileUrl } from './tileUrl';

export class KVPTileUrl extends TileUrl {
  constructor(parsedCapabilities) {
    super();
    this.tileUrl = parsedCapabilities.OperationsMetadata.Operation.DCP.HTTP.Get.attributes.href;
    this._allQueryParams = {
      service: 'WMTS',
      format: 'image/png',
      request: 'GetTile',
      style: '',
      tileMatrixSet: '{TileMatrixSet}',
      tileRow: '{TileRow}',
      tileCol: '{TileCol}',
      tileMatrix: '{TileMatrix}',
    };
  }

  insertQueryParams(newQueryParams) {
    for (const [key, value] of Object.entries(newQueryParams)) {
      this._allQueryParams[`${key}`] = value;
    }
    this.#addParametersToUrl();
  }

  #addParametersToUrl() {
    for (const [key, value] of Object.entries(this._allQueryParams)) {
      this.tileUrl += `&${key}`;
    }
    if (!this.#hasRequiredParams()) {
      throw new Error(
        "Required query params were not set. params must include 'layer' and url must include 'layer', 'service', 'format', 'version', 'request', 'style' "
      );
    }
  }

  #hasRequiredParams() {
    return (
      this.tileUrl.includes('LAYER') &&
      this.tileUrl.includes('FORMAT') &&
      this.tileUrl.includes('VERSION') &&
      this.tileUrl.includes('REQUEST') &&
      this.tileUrl.includes('STYLE') &&
      this.tileUrl.includes('tilematrixset') &&
      this.tileUrl.includes('tilerow') &&
      this.tileUrl.includes('tilecol') &&
      this.tileUrl.includes('tilematrix')
    );
  }
}
