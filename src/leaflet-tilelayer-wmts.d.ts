import { TileLayerOptions } from 'leaflet';
interface WMTSLayerOptions extends L.TileLayerOptions {
  layer: string;
  style: string;
  tilematrixSet: string;
  format: string;
  attribution: string;
}

declare module 'leaflet' {
  namespace TileLayer {
    function WMTS(url: string, options?: WMTSLayerOptions): TileLayer;
  }
}
