//module.exports = TileUrl;
export class TileUrl {
  tileUrl;
  _allQueryParams;

  constructor() {
    if (this.constructor == TileUrl) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  insertQueryParams(newQueryParams) {
    throw new Error("Method 'setQueryParams' must be implemented.");
  }
}
