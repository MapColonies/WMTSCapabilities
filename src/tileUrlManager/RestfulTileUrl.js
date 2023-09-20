import { TileUrl } from './TileUrl.js';

export class RestfulTileUrl extends TileUrl {
  constructor(parsedCapabilities) {
    super();
    const fullUrl = parsedCapabilities.ServiceMetadataURL.attributes.href;
    this.tileUrl = fullUrl.substring(0, fullUrl.indexOf('/wmts/1.0.0/WMTSCapabilities.xml'));

    //order is important, this is why all params are decleared as base.
    this._allQueryParams = {
      service: 'wmts',
      layer: '',
      tileMatrixSet: '{TileMatrixSet}',
      tileMatrix: '{TileMatrix}',
      tileCol: '{TileCol}',
      tileRow: '{TileRow}',
      format: 'png',
    };
  }

  insertQueryParams(newQueryParams) {
    for (const [key, value] of Object.entries(newQueryParams)) {
      this._allQueryParams[key] = value;
    }
    this._addParametersToUrl();
  }

  _isTemplateParam(key) {
    return key === 'service' || key === 'layer' || key === 'tileMatrixSet' || key === 'tileMatrix' || key === 'tileCol' || key === 'tileRow';
  }
  _addParametersToUrl() {
    if (this._allQueryParams['layer'] === '') {
      throw new Error("'layer' was not defined at query params");
    }
    for (const [key, value] of Object.entries(this._allQueryParams)) {
      // as base rest url has to be {Service}/{Layer}/{TileMatrixSet}/{TileMatrix}/{TileCol}/{TileRow}.{Format} and all those default params are set.
      if (this._isTemplateParam(key)) {
        this.tileUrl += `/${value}`;
      } else if (key === 'format') {
        this.tileUrl += `.${value}`;
      } else {
        this.tileUrl += `?${key}=${value}`;
      }
    }
  }
}
