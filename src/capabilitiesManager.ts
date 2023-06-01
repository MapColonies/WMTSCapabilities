import L from 'leaflet';
import { WMTSOptions, WMTS } from './WMTSOptions';

const SUCCESS_STATUS_CODE = 200;

export async function getWMTSCapabilities(url: string, token?: string): Promise<any> {
  try {
    const reqXmlUrl = token ? `${url}/wmts/1.0.0/WMTSCapabilities.xml?token=${token}` : `${url}/wmts/1.0.0/WMTSCapabilities.xml`;
    const response = await fetch(reqXmlUrl);

    if (response.status === SUCCESS_STATUS_CODE) {
      const capabilitiesXml = await response.text();
      const xmlJs = require('xml-js');
      // Convert XML to JSON
      const options = {
        compact: true,
        ignoreDeclaration: true,
        ignoreComment: true,
        ignoreCdata: true,
        ignoreDoctype: true,
        ignoreInstruction: true,
        textKey: '_text',
      };
      return xmlJs.xml2js(capabilitiesXml, options);
    } else {
      throw new Error('Failed to retrieve WMTS capabilities');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error retrieving WMTS capabilities: ${message}`);
  }
}

// console.log(
//   getWMTSCapabilities(
//     'https://mapproxy-raster-dev-route-raster-dev.apps.j1lk3njp.eastus.aroapp.io/api/raster/v1',
//     'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXBDb2xvbmllc0RldiIsImlhdCI6MTUxNjIzOTAyMiwiZCI6WyJyYXN0ZXIiLCJyYXN0ZXJXbXMiLCJyYXN0ZXJFeHBvcnQiLCJkZW0iLCJ2ZWN0b3IiLCIzZCJdfQ.GvTQ_yLjnioxxFrNgGQiuarhJxLpe8AhTTtrWE3LHoUED48CFKBEOfKqOyEWSDVZjx1jHkDvZAL1iyEvi5FHNys7UBRXCiJvVlG-muJZ6ycS9PGKauzL-eggXqTqGsXh4FBkqvHUEElXEnu7ARsMCm5eIC66U2i_eHFU3PLcOc67qJvS1IQjAI2oj9Pd5mGaI_HlDaf3B4PFOb0AHdY-r_MDGwck3asm1G_InVzsvCXt36vImyn1Z4HYaN4YiDfaMLBF0-GGrlLE84PObzGGtt66EIuQ4OneEZSzoQNusBt5-SFs0EQXsfsDc_RMRTz3DZseqkNIKiXEsEBBPjMr7w'
//   )
// );

getLayer(
  getWMTSCapabilities(
    'https://mapproxy-raster-dev-route-raster-dev.apps.j1lk3njp.eastus.aroapp.io/api/raster/v1',
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJNYXBDb2xvbmllc0RldiIsImlhdCI6MTUxNjIzOTAyMiwiZCI6WyJyYXN0ZXIiLCJyYXN0ZXJXbXMiLCJyYXN0ZXJFeHBvcnQiLCJkZW0iLCJ2ZWN0b3IiLCIzZCJdfQ.GvTQ_yLjnioxxFrNgGQiuarhJxLpe8AhTTtrWE3LHoUED48CFKBEOfKqOyEWSDVZjx1jHkDvZAL1iyEvi5FHNys7UBRXCiJvVlG-muJZ6ycS9PGKauzL-eggXqTqGsXh4FBkqvHUEElXEnu7ARsMCm5eIC66U2i_eHFU3PLcOc67qJvS1IQjAI2oj9Pd5mGaI_HlDaf3B4PFOb0AHdY-r_MDGwck3asm1G_InVzsvCXt36vImyn1Z4HYaN4YiDfaMLBF0-GGrlLE84PObzGGtt66EIuQ4OneEZSzoQNusBt5-SFs0EQXsfsDc_RMRTz3DZseqkNIKiXEsEBBPjMr7w'
  )
);

export function getLayer(capabilities: any) {
  const matrixSet = capabilities.Contents.TileMatrixSet[0];
  const tileMatrix = matrixSet.TileMatrix;
  const tileMatrixIds = tileMatrix.map((matrix: any) => matrix.Identifier);

  const tileFormat = capabilities.Contents.Format[0];

  const tileUrls = capabilities.Contents.TileMatrixSetLink[0].TileResourceURL.map((resource: any) => resource.Template);

  const wmtsLayer = new WMTS(tileUrls, {
    layer: 'your-layer-name',
    format: tileFormat,
    matrixSet: matrixSet.Identifier,
    tileSize: 256,
    style: 'default',
    tilematrixSet: matrixSet.Identifier,
    tilematrixIds: tileMatrixIds,
  });

  console.log(wmtsLayer);

  const map = L.map('map').setView([51.505, -0.09], 13);
  wmtsLayer.addTo(map);
}
