import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";

type AppGeofenceViewProps = {
  geofence?: any;
};

export const AppGeofenceView = ({ geofence }: AppGeofenceViewProps) => {
  const mapRef = useRef<any>();
  return (
    <div className="flex flex-col w-full col-span-12">
      {!geofence ? (
        ""
      ) : (
        <MapContainer
          ref={mapRef}
          center={[29.424349, -98.491142]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: "60vh", width: "80wh" }}
          id="mapGeofence"
        >
          <MapFlyCenter />
          {geofence &&
            geofence.map((geo: any) => (
              <GeoJSON
                key={"geofence-defendant"}
                data={geo}
                style={
                  geofence.idAlarmType === 1
                    ? { color: "red" }
                    : { color: "blue" }
                }
              />
            ))}
          <FullscreenControl
            position="topright"
            title="Fullscreen mode"
            titleCancel="Exit fullscreen mode"
            content={"[ ]"}
          />

          <TileLayer
            attribution="&copy; OpenStreetMap</a> "
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      )}
    </div>
  );
};
type MapFlyCenterProps = {
  id?: number | null;
};
export const MapFlyCenter = ({}: MapFlyCenterProps) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([29.424349, -98.491142], 10);
  }, []);
  return null;
};
