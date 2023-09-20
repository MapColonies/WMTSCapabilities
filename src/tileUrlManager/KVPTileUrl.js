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
    this._setParametersToUrl();
  }

  _setParametersToUrl() {
    //convert to URL type
    const baseUrl = new URL(this.tileUrl);

    //define as URLSearchParams
    const allQueryParams = new URLSearchParams(baseUrl.search);

    //append URLSearchParams together
    for (const [key, value] of Object.entries(this._allQueryParams)) {
      allQueryParams.append(key, value);
    }

    //append URLSearchParams to URL and convert it backt to string
    const queryParamsStr = allQueryParams.toString();

    if (!this._hasRequiredParams(queryParamsStr)) {
      throw new Error(
        "Required query params were not set. params must include 'layer' and url must include 'layer', 'version', 'service', 'format', 'version', 'request', 'style' "
      );
    } else {
      //take url before first query param or url
      this.tileUrl = this.tileUrl.split('?')[0] + '?' + queryParamsStr;
    }
  }

  _hasRequiredParams(url) {
    return (
      url.includes('layer') &&
      url.includes('format') &&
      url.includes('version') &&
      url.includes('request') &&
      url.includes('style') &&
      url.includes('tileMatrixSet') &&
      url.includes('tileRow') &&
      url.includes('tileCol') &&
      url.includes('tileMatrix')
    );
  }
}
