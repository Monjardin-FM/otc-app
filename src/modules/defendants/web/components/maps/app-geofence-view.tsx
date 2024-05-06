import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { GeoJSONO } from "../../../domain/entities/geoJSON";
import { useGetDefendantAlarmById } from "../../hooks/use-get-alarm-defendant-by-id";

type AppGeofenceViewProps = {
  idPersonSpecificAlarm?: number | null;
};

export const AppGeofenceView = ({
  idPersonSpecificAlarm,
}: AppGeofenceViewProps) => {
  const mapRef = useRef<any>();
  const [geofence, setGeofence] = useState<any>();
  const { defendantAlarmById, getDefendantAlarmById, loading } =
    useGetDefendantAlarmById();
  const [center, setCenter] = useState<[number, number]>();

  // useEffect to fetch defendant alarm
  useEffect(() => {
    if (idPersonSpecificAlarm)
      getDefendantAlarmById({ idPersonSpecificAlarm: idPersonSpecificAlarm });
  }, [idPersonSpecificAlarm]);

  useEffect(() => {
    if (defendantAlarmById) {
      const geofenceJSON: GeoJSONO = JSON.parse(
        defendantAlarmById?.lGeofence[0].geofence
      );
      const coordinates = geofenceJSON.features[0].geometry.coordinates[0];
      setGeofence(geofenceJSON);
      const center = coordinates[0];
      setCenter(center);
    }
  }, [defendantAlarmById]);

  useEffect(() => {
    return () => {
      setGeofence(null);
      setCenter([0, 0]);
    };
  }, []);
  return (
    <div className="flex flex-col w-full">
      {loading ? (
        ""
      ) : (
        <MapContainer
          ref={mapRef}
          center={[29.424349, -98.491142]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: "60vh", width: "100wh" }}
          id="mapGeofence"
        >
          <MapFlyCenter center={center} id={idPersonSpecificAlarm} />
          <GeoJSON key={"geofence-defendant"} data={geofence} />
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
  center?: [number, number];
  id?: number | null;
};
export const MapFlyCenter = ({ center, id }: MapFlyCenterProps) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo([29.424349, -98.491142], 14);
  }, [center, id]);
  return null;
};
