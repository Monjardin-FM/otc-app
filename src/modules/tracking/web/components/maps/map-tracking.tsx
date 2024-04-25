import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as Icon from "react-feather";
import { HistoricPosition } from "../../../domain/entities/historic-position";
type MapTrackingProps = {
  historicPosition?: HistoricPosition[];
};
export const MapTracking = ({ historicPosition }: MapTrackingProps) => {
  // const position = [51.505, -0.09]
  return (
    <MapContainer
      center={[29.42412, -98.49363]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "70vh", width: "100wh" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap</a> "
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {historicPosition?.map((position) => (
        <Marker
          position={[position.lat, position.lon]}
          key={position.lat * position.lon}
        >
          <Popup>
            <ul>
              <li className="flex flex-row items-center gap-1">
                <Icon.Heart size={10} color="red" />
                <span>{`Cardio Frequency: ${position.cardioFrequency}`}</span>
              </li>

              <li className="flex flex-row items-center gap-1">
                <Icon.Battery size={10} color="green" />
                <span>{`Battery: ${position.battery}`}</span>
              </li>
              <li className="flex flex-row items-center gap-1">
                <Icon.Calendar size={10} color="blue" />
                <span>{`Date: ${position.positionDate}`}</span>
              </li>
              <li className="flex flex-row items-center gap-1">
                <Icon.Shield size={10} color="red" />
                <span>{`Blood Oxygen: ${position.bloodOxygen}`}</span>
              </li>
            </ul>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
