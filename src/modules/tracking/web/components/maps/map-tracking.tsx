import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import * as Icon from "react-feather";
import { HistoricPosition } from "../../../domain/entities/historic-position";
import { TrackingDetail } from "../../../domain/entities/tracking-detail";
import dayjs from "dayjs";
import "dayjs/locale/es"; // Importa el idioma local si es necesario
import localizedFormat from "dayjs/plugin/localizedFormat"; // Importa el plugin para el formato local

type MapTrackingProps = {
  historicPosition?: HistoricPosition[];
  trackingDetail?: TrackingDetail;
};
export const MapTracking = ({
  historicPosition,
  trackingDetail,
}: MapTrackingProps) => {
  const [positionDefendant, setPositionDefendant] = useState<number[]>();
  dayjs.extend(localizedFormat);
  useEffect(() => {
    if (trackingDetail) {
      setPositionDefendant([
        trackingDetail?.person[0].personPosition.lat,
        trackingDetail?.person[0].personPosition.lon,
      ]);
    }
  }, [trackingDetail]);
  return (
    <>
      {" "}
      {positionDefendant ? (
        <MapContainer
          center={[
            trackingDetail?.person[0].personPosition.lat ?? 0,
            trackingDetail?.person[0].personPosition.lon ?? 0,
          ]}
          zoom={20}
          scrollWheelZoom={true}
          style={{ height: "70vh", width: "100wh" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap</a> "
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* <Marker>

          </Marker> */}
          <Marker
            position={[
              trackingDetail?.person[0].personPosition.lat ?? 0,
              trackingDetail?.person[0].personPosition.lon ?? 0,
            ]}
            key={trackingDetail?.person[0].idPerson}
          >
            <Popup>
              <ul>
                <li className="flex flex-row items-center gap-1">
                  <Icon.Heart size={10} color="red" />
                  <span>{`Cardio Frequency: ${trackingDetail?.person[0].personPosition.cardioFrequency}`}</span>
                </li>

                <li className="flex flex-row items-center gap-1">
                  <Icon.Battery size={10} color="green" />
                  <span>{`Battery: ${trackingDetail?.person[0].personPosition.battery}`}</span>
                </li>
                <li className="flex flex-row items-center gap-1">
                  <Icon.Calendar size={10} color="blue" />
                  <span>{`Date: ${dayjs(
                    trackingDetail?.person[0].personPosition.positionDate
                  ).format("DD/MM/YYYY HH:mm:ss")}`}</span>
                </li>
                <li className="flex flex-row items-center gap-1">
                  <Icon.Shield size={10} color="red" />
                  <span>{`Blood Oxygen: ${trackingDetail?.person[0].personPosition.bloodOxygen}`}</span>
                </li>
              </ul>
            </Popup>
          </Marker>
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
      ) : (
        <div>Loading</div>
      )}
    </>
  );
};
