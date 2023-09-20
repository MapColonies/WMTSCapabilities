# Map Colonies WMTSLayer-Leaflet

----
Intro
-------------

leaflet-based package will allow clients to create WMTS layers.
The WMTSLayer-leaflet package will use Map Colonies's wmts-capabilities-parser to optimize retrieving and supplying the wmts layers.

----
Compatibility
-------------

supported on Chrome version 55+ 
supported on Firefox 52+

----
Product
-------------

Support leaflet 1.X versions

Support old chrome-firefox versions 
& react-leaflet

Custom query params

Custom headers

Ability to choose projection and other leaflet layer params

Simple to use

----
How To use
-------------
`npm i wmts-layer-leaflet` or add the following: ` <script> src="https://unpkg.com/wmts-layer-leaflet@1.0.0/src/index.js"</script>`

`import L from "leaflet";`

`import { getLayer, getLayerByCapabilities } from "@map-colonies/wmts-layer-leaflet";`

----
Service
-------------
#### Functions
`getLayer(url, identifier, queryParams, headersParams)`

#### Purpose/ Usage

Returns a Promise - WMTS layer according to the capabilities pulled from URL and identifier.

#### Output
`TileLayer` object -WMTS leaflet layer.

Where `identifier` couldn’t be found - `Error("Failed to find Layer with given identifier")`

When response did not Succeded - `Error("Failed to retrieve WMTS capabilities")`

When request capabilites failed - `Error(Error retrieving WMTS capabilities: ${originalMessage})`


#### Example

`const map = L.map("map").setView([0, 0], 2);`

`const wmtsLayer = await getLayer("https://mapproxyurl/v1", 'bluemarble-Orthophoto', {"token": authToken});`

`wmtsLayer.addTo(map)`

### End
