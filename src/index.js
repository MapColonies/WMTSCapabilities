export function getLayerByCapabilities(capabilities, identifier, queryParams) {
  const token = queryParams.get('token');
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

  return token ? addToken(replacedUrl, token) : replacedUrl;
}

function getCapabilitiesUrl(url, queryParams) {
  const token = queryParams.get('token');
  let reqUrl;

  if (String(url).includes('WMTSCapabilities.xml') || String(url).includes('REQUEST=GetCapabilities')) {
    reqUrl = token ? addToken(url, token) : url;
  } else {
    const version = '1.0.0';
    reqUrl = token ? addToken(`${url}/wmts/${version}/WMTSCapabilities.xml`, token) : `${url}/wmts/${version}/WMTSCapabilities.xml`;
  }
  return reqUrl;
}

function addToken(url, token) {
  return String(url).includes('?') ? url + `&token=${token}` : `?token=${token}`;
}

export async function getWMTSCapabilities(url, queryParams, headerParams) {
  const SUCCESS_STATUS_CODE = 200;

  try {
    const reqXmlUrl = getCapabilitiesUrl(url, queryParams);
    const response = await fetch(reqXmlUrl, { headers: headerParams });

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

export async function getLayer(url, identifier, queryParams, headersParams) {
  return getLayerByCapabilities(await getWMTSCapabilities(url, queryParams, headersParams), identifier, queryParams);
}
