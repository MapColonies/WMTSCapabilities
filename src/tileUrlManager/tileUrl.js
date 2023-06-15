class TileUrl {
  tileUrl;

  constructor() {
    if (this.constructor == TileUrl) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  addParameters() {
    throw new Error("Method 'addParameters()' must be implemented.");
  }

  getTileUrl() {
    throw new Error("Method 'getTileUrl()' must be implemented.");
  }
}
