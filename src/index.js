const { KVPTileUrl } = require('./tileUrlManager/KVPTileUrl');
const { RestfulTileUrl } = require('./tileUrlManager/RestfulTileUrl');
const { getWMTSCapabilities } = require('@map-colonies/wmts-capabilities-parser');
module.exports = { getLayer, getLayerByCapabilities };

function getLayerByCapabilities(capabilities, identifier, queryParams) {
  const allLayers = capabilities.Contents.Layer;
  const chosenLayer = Array.from(allLayers).find((layer) => layer.Identifier.textContent === identifier);

  if (chosenLayer) {
    const { tileMatrixSet, title, style, format } = extractLayerProperties(chosenLayer);

    //kvp or rest
    let tileUrlObj;
    let allQueryParams;
    if (capabilities.OperationsMetadata) {
      tileUrlObj = new KVPTileUrl(capabilities);
      allQueryParams = Object.assign(
        {
          layer: title,
          style: style,
          tileMatrixSet: tileMatrixSet,
          format: format,
        },
        queryParams
      );
    } else {
      tileUrlObj = new RestfulTileUrl(capabilities);
      allQueryParams = Object.assign(
        {
          layer: title,
          tileMatrixSet: tileMatrixSet,
        },
        queryParams
      );
    }

    tileUrlObj.insertQueryParams(allQueryParams);

    const validUrl = replaceTileUrlPlaceholders(tileUrlObj.tileUrl, tileMatrixSet);

    const wmtsLayer = L.tileLayer(validUrl, {
      layers: title,
      style: style,
      format: format,
      tilematrixset: tileMatrixSet,
    });

    return wmtsLayer;
  } else {
    throw new Error('Failed to find Layer with given identifier');
  }
}

function extractLayerProperties(selectedLayer) {
  const title = selectedLayer.Title.textContent;
  const format = selectedLayer.Format.textContent;
  const tileMatrixSet = selectedLayer.TileMatrixSetLink.TileMatrixSet.textContent;
  const style = selectedLayer.Style.Identifier.textContent;
  return { tileMatrixSet, title, style, format };
}

function replaceTileUrlPlaceholders(url, tileMatrixSet) {
  return String(url).replace('{TileMatrixSet}', tileMatrixSet).replace('{TileMatrix}', '{z}').replace('{TileCol}', '{x}').replace('{TileRow}', '{y}');
}

async function getLayer(url, identifier, queryParams, headersParams) {
  return getLayerByCapabilities(await getWMTSCapabilities(url, queryParams, headersParams), identifier, queryParams);
}
