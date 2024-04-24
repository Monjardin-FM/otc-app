import {
  FeatureGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

export const App = () => {
  const _created = (e: any) => {
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

  return (
    <>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100vh", width: "100wh" }}
        id="map"
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_created}
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
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </>
  );
};
