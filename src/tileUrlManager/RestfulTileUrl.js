import { TileUrl } from './tileUrl';

export class RestfulTileUrl extends TileUrl {
  constructor(parsedCapabilities) {
    super();
    const fullUrl = parsedCapabilities.ServiceMetadataURL.attributes.href;
    this.tileUrl = fullUrl.substring(0, fullUrl.indexOf('1.0.0/WMTSCapabilities.xml'));

    //order is important, this is why all params are decleared as base.
    this._allQueryParams = {
      layer: '',
      tileMatrixSet: '{TileMatrixSet}',
      tileMatrix: '{TileMatrix}',
      tileCol: '{TileCol}',
      tileRow: '{TileRow}',
      format: '.png',
    };
  }

  insertQueryParams(newQueryParams) {
    for (const [key, value] of Object.entries(newQueryParams)) {
      this._allQueryParams[`${key}`] = value;
    }
    this.#addParametersToUrl();
  }

  #addParametersToUrl() {
    if (this._allQueryParams['layer'] === '') {
      throw new Error("'layer' was not defined at query params");
    }
    for (const [key, value] of Object.entries(this._allQueryParams)) {
      //format is the last param to end url with a dot.
      if (key != 'format') {
        this.tileUrl += `/${value}`;
      } else {
        this.tileUrl += `.${value}`;
      }
    }
  }
}
