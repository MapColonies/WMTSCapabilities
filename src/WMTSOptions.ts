import L, { TileLayerOptions } from 'leaflet';

export interface WMTSOptions extends TileLayerOptions {
  layer: String;
  format: String;
  matrixSet: String;
  tileSize?: number | 256;
  style: String | 'default';
  tilematrixSet: String;
  tilematrixIds?: String;
}

export class WMTS extends L.TileLayer {
  constructor(url: string, options?: WMTSOptions);
}
