import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";
import { useRef } from "react";
export const AppGeofence = () => {
  const created = (e: any) => {
    console.log(e);
    const { layerType, layer } = e;
    if (layerType === "circle") {
      const center = layer.getLatLng();
      const centerPt = [center.lng, center.lat];
      console.log(centerPt);
      const radius = layer.getRadius();
      console.log(radius);
    }
  };
  const mapRef = useRef<any>();
  return (
    <>
      <MapContainer
        ref={mapRef}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100vh", width: "100wh" }}
        id="map"
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={created}
            draw={{
              rectangle: false,
              circle: true,
              circlemarker: false,
              marker: false,
              polyline: false,
            }}
          />
        </FeatureGroup>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <EsriLeafletGeoSearch
          providers={{
            arcgisOnlineProvider: {
              token:
                "AAPK8dc805f8e8f24210bf4fefcfb9d5cc92vWrwGctqdzYnfO41yhFJ9iLw90RNaJwPM8FEaYlh91ctycL2ZrR2pYrVNAaMSzBs",
              label: "ArcGIS Online Results",
              maxResults: 10,
            },
          }}
          useMapBounds={false}
          position="topright"
          key={
            "AAPK8dc805f8e8f24210bf4fefcfb9d5cc92vWrwGctqdzYnfO41yhFJ9iLw90RNaJwPM8FEaYlh91ctycL2ZrR2pYrVNAaMSzBs"
          }
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
};
