import { TileUrl } from './TileUrl.js';

export class KVPTileUrl extends TileUrl {
  constructor(parsedCapabilities) {
    super();
    this.tileUrl = parsedCapabilities.OperationsMetadata.Operation.DCP.HTTP.Get.attributes.href;
    this._allQueryParams = {
      service: 'WMTS',
      format: 'image/png',
      version: '1.0.0',
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
      this.tileUrl += `&${key}=${value}`;
    }
    if (!this.#hasRequiredParams()) {
      throw new Error(
        "Required query params were not set. params must include 'layer' and url must include 'layer', 'version', 'service', 'format', 'version', 'request', 'style' "
      );
    }
  }

  #hasRequiredParams() {
    return (
      this.tileUrl.includes('layer') &&
      this.tileUrl.includes('format') &&
      this.tileUrl.includes('version') &&
      this.tileUrl.includes('request') &&
      this.tileUrl.includes('style') &&
      this.tileUrl.includes('tileMatrixSet') &&
      this.tileUrl.includes('tileRow') &&
      this.tileUrl.includes('tileCol') &&
      this.tileUrl.includes('tileMatrix')
    );
  }
}
