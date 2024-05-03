import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import * as Icon from "react-feather";
import dayjs from "dayjs";
import { HistoricPosition } from "../../../domain/entities/historic-position";
import { FullscreenControl } from "react-leaflet-fullscreen";
import { Card, Skeleton } from "@nextui-org/react";
import { Player } from "@lottiefiles/react-lottie-player";
import MapPosition from "../../../../../assets/json/position.json";
import { MyLayer } from "./markers";
type FlyNewPositionProps = {
  positionDefendant: number[];
  historicPosition?: HistoricPosition[] | [];
};
// Marker with last position
export const FlyNewPosition = ({
  historicPosition,
  positionDefendant,
}: FlyNewPositionProps) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(
      [
        positionDefendant[positionDefendant.length - 1],
        positionDefendant[positionDefendant.length - 1],
      ],
      20
    );
  }, [positionDefendant]);

  return positionDefendant &&
    historicPosition &&
    historicPosition.length > 0 ? (
    <Marker
      key={1}
      position={[positionDefendant[0], positionDefendant[1]]}
      //ref={markerRef}
    >
      <Popup>
        <div className="flex flex-col gap-2">
          <h1 className="text-red-700 text-center font-semibold">{`Last Position`}</h1>
          <ul>
            <li className="flex flex-row items-center gap-1">
              <Icon.Heart size={10} color="red" />
              <span>{`Cardio Frequency: ${
                historicPosition[historicPosition.length - 1].cardioFrequency
              }`}</span>
            </li>

            <li className="flex flex-row items-center gap-1">
              <Icon.Battery size={10} color="green" />
              <span>{`Battery: ${
                historicPosition[historicPosition.length - 1].battery
              }`}</span>
            </li>
            <li className="flex flex-row items-center gap-1">
              <Icon.Calendar size={10} color="blue" />
              <span>{`Date: ${dayjs
                .utc(historicPosition[historicPosition.length - 1].positionDate)
                .local()
                .format("DD/MM/YYYY HH:mm:ss A")}`}</span>
            </li>
            {}
            <li className="flex flex-row items-center gap-1">
              <Icon.Shield size={10} color="red" />
              <span>{`Blood Oxygen: ${
                historicPosition[historicPosition.length - 1].bloodOxygen
              }`}</span>
            </li>
          </ul>
        </div>
      </Popup>
    </Marker>
  ) : null;
};

type MapTrackingProps = {
  historicPosition?: HistoricPosition[];
};
export const MapHistoricPosition = ({
  historicPosition,
}: // historicPosition,
MapTrackingProps) => {
  const [positionDefendant, setPositionDefendant] = useState([0, 0]);
  const [isPositionDefendant, setIspositionDefendant] = useState(false);
  useEffect(() => {
    if (historicPosition && historicPosition.length > 0) {
      setPositionDefendant([historicPosition[0].lat, historicPosition[0].lon]);
      setIspositionDefendant(true);
    } else {
      setPositionDefendant([0, 0]);
      setIspositionDefendant(false);
    }
  }, [historicPosition]);

  return (
    <>
      {isPositionDefendant ? (
        <MapContainer
          center={
            positionDefendant
              ? [positionDefendant[0], positionDefendant[1]]
              : [0, 0]
          }
          zoom={20}
          scrollWheelZoom={true}
          style={{ height: "70vh", width: "100wh" }}
          preferCanvas
        >
          <FullscreenControl
            position="topright"
            title="Fullscreen mode"
            titleCancel="Exit fullscreen mode"
            content={"[ ]"}
          />
          <FlyNewPosition
            positionDefendant={positionDefendant}
            historicPosition={historicPosition}
          />
          <MyLayer positions={historicPosition} />
          <TileLayer
            attribution="&copy; OpenStreetMap</a> "
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      ) : (
        <Card className="w-full space-y-5 p-4" radius="lg">
          <div className="h-1/2 rounded-lg bg-transparent flex items-center justify-center flex-col">
            <Player
              autoplay
              loop
              src={MapPosition}
              style={{ height: "300px", width: "300px" }}
            />
            <span className="text-primaryColor-900 font-semibold">
              No position Found
            </span>
          </div>
          <div className="space-y-3">
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-full rounded-lg">
              <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
        </Card>
      )}
    </>
  );
};
