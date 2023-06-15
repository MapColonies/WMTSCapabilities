class KVPTileUrl extends TileUrl {
  constructor(url) {
    this.tileUrl = url;
  }

  addParameters(layerName, format, version, queryParams) {
    this.tileUrl = `${this.tileUrl}&LAYER=${layerName}&FORMAT=${format}&VERSION=${version}&tilematrixset={TileMatrixSet}&&tilerow={TileRow}&tilecol={TileCol}&tilematrix={TileMatrix}`;
    for (const [key, value] of queryParams.entries()) {
      this.tileUrl + `${key.toUpperCase()}=${value}`;
    }
  }

  getTileUrl(parsedCapabilities) {
    this.tileUrl = parsedCapabilities.OperationsMetadata.Get.attributes.href;
  }
}
