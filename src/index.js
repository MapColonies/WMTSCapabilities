export function getLayerByCapabilities(capabilities, identifier, token) {
  const allIdentifiers = capabilities.querySelectorAll('Identifier');
  const selectedIdentifier = Array.from(allIdentifiers).find((currentIdentifier) => currentIdentifier.textContent === identifier);

  if (selectedIdentifier) {
    const fittingLayer = selectedIdentifier.parentNode;
    const { tileUrlTemplate, tileMatrixSet, title, style, format } = extractLayerProperties(fittingLayer);

    const validUrl = replaceTileUrlPlaceholders(tileUrlTemplate, tileMatrixSet, token);

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
  const title = selectedLayer.querySelector('Title').textContent;
  const tileUrlTemplate = selectedLayer.querySelector('ResourceURL').attributes.template.textContent;
  const style = selectedLayer.querySelector('Format').textContent;
  const tileMatrixSet = selectedLayer.querySelector('TileMatrixSet').textContent;
  const format = selectedLayer.querySelector('Style').children[0].textContent;
  return { tileUrlTemplate, tileMatrixSet, title, style, format };
}

function replaceTileUrlPlaceholders(url, tileMatrixSet, token) {
  const replacedUrl = url
    .replace('{TileMatrixSet}', tileMatrixSet)
    .replace('{TileMatrix}', '{z}')
    .replace('{TileCol}', '{x}')
    .replace('{TileRow}', '{y}');

  return token ? replacedUrl + `?token=${token}` : replacedUrl;
}

function getCapabilitiesUrl(url, queryParams) {
  const token = queryParams.get('token');
  let reqUrl;
  if (String(url).includes('WMTSCapabilities.xml')) {
    reqUrl = token ? url + `?token=${token}` : url;
  } else {
    if (String(url).includes('REQUEST=GetCapabilities')) {
      reqUrl = token ? url + `&token=${token}` : url;
    } else {
      const version = '1.0.0';
      reqUrl = token ? `${url}/wmts/${version}/WMTSCapabilities.xml?token=${token}` : `${url}/wmts/${version}/WMTSCapabilities.xml`;
    }
  }
}
export async function getWMTSCapabilities(url, queryParams) {
  const SUCCESS_STATUS_CODE = 200;

  try {
    const reqXmlUrl = getCapabilitiesUrl(url, queryParams);
    const response = await fetch(reqXmlUrl);

    if (response.status === SUCCESS_STATUS_CODE) {
      const capabilitiesXml = await response.text();
      const parser = new DOMParser();
      const parsedXml = parser.parseFromString(capabilitiesXml, 'text/xml');

      return parsedXml.documentElement;
    } else {
      throw new Error('Failed to retrieve WMTS capabilities');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error retrieving WMTS capabilities: ${message}`);
  }
}

export async function getLayer(url, identifier, token) {
  return getLayerByCapabilities(await getWMTSCapabilities(url, token), identifier, token);
}
