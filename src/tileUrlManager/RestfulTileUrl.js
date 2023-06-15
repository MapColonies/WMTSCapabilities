class RestfulTileUrl extends TileUrl {
  constructor(url) {
    this.tileUrl = url;
  }

  addParameters() {
    throw new Error("Method 'addParameters()' must be implemented.");
  }

  getTileUrl() {
    throw new Error("Method 'getTileUrl()' must be implemented.");
  }
}
