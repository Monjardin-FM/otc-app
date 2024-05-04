import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, useMap, Marker } from "react-leaflet";
import * as IconFeather from "react-feather";
import { HistoricPosition } from "../../../domain/entities/historic-position";
import {
  Person,
  TrackingDetail,
} from "../../../domain/entities/tracking-detail";
import "dayjs/locale/es"; // Importa el idioma local si es necesario
import { Card, Skeleton } from "@nextui-org/react";
import { Player } from "@lottiefiles/react-lottie-player";
import MapPositon from "../../../../../assets/json/position.json";
import { FullscreenControl } from "react-leaflet-fullscreen";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Importa el plugin UTC de Day.js
import timezone from "dayjs/plugin/timezone"; // Importa el plugin de zona horaria de Day.js
import { Icon } from "leaflet";
import DefIcon from "../../../../../assets/icons/defendant-marker.png";
import { useEffectOnce } from "react-use";
dayjs.extend(utc);
dayjs.extend(timezone);
type MapTrackingProps = {
  historicPosition?: HistoricPosition[];
  trackingDetail?: TrackingDetail;
  onClose: () => void;
};
type FlyNewPositionProps = {
  positionDefendant: number[];
  defendantItem?: Person;
};
export const FlyNewPosition = ({
  defendantItem,
  positionDefendant,
}: FlyNewPositionProps) => {
  const map = useMap();
  // useEffect(() => {
  //   map.flyTo([positionDefendant[0], positionDefendant[1]], 18);

  //   console.log("Running effect once on mount");
  //   if (
  //     positionDefendant &&
  //     positionDefendant[0] > 0 &&
  //     positionDefendant[1] > 0
  //   ) {
  //     map.flyTo([positionDefendant[0], positionDefendant[1]], 18);
  //   }

  //   return () => {
  //     // map.flyTo([positionDefendant[0], positionDefendant[1]], 18);
  //     console.log("Running clean-up of effect on unmount");
  //   };
  // }, []);

  useEffectOnce(() => {
    if (positionDefendant)
      map.flyTo([positionDefendant[0], positionDefendant[1]], 18);
  });
  const legalIcon = new Icon({
    iconUrl: DefIcon,
    iconSize: [35, 35], // size of the icon
    iconAnchor: [17.5, 35], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
  });
  return positionDefendant ? (
    <Marker
      key={defendantItem?.idDefendant}
      position={[positionDefendant[0], positionDefendant[1]]}
      icon={legalIcon}
      //ref={markerRef}
    >
      <Popup>
        <div className="flex flex-col gap-2">
          <h1 className="text-red-700 text-center font-semibold">{`Defendant: ${defendantItem?.name} ${defendantItem?.lastName}`}</h1>
          <ul>
            <li className="flex flex-row items-center gap-1">
              <IconFeather.Heart size={10} color="red" />
              <span>{`Cardio Frequency: ${defendantItem?.personPosition.cardioFrequency}`}</span>
            </li>

            <li className="flex flex-row items-center gap-1">
              <IconFeather.Battery size={10} color="green" />
              <span>{`Battery: ${defendantItem?.personPosition.battery}`}</span>
            </li>
            <li className="flex flex-row items-center gap-1">
              <IconFeather.Calendar size={10} color="blue" />
              <span>{`Date: ${dayjs
                .utc(defendantItem?.personPosition.positionDate)
                .local()
                .format("DD/MM/YYYY HH:mm:ss A")}`}</span>
            </li>
            <li className="flex flex-row items-center gap-1">
              <IconFeather.Shield size={10} color="red" />
              <span>{`Blood Oxygen: ${defendantItem?.personPosition.bloodOxygen}`}</span>
            </li>
          </ul>
        </div>
      </Popup>
    </Marker>
  ) : null;
};
export const MapTracking = ({
  // historicPosition,
  trackingDetail,
}: MapTrackingProps) => {
  const [positionDefendant, setPositionDefendant] = useState([0, 0]);
  const [isPositionDefendant, setIspositionDefendant] = useState(false);
  const [defendantItem, setDefendantItem] = useState<Person>();
  const [victims, setVictims] = useState<Person[] | null>();
  useEffect(() => {
    if (trackingDetail) {
      const defendantPos = trackingDetail.person.find(
        (person) => person.idPersonType === 2
      );
      const victimsDefendant = trackingDetail.person.filter(
        (person) => person.idPersonType === 3
      );
      if (defendantPos && defendantPos.personPosition) {
        setDefendantItem(defendantPos);
        setPositionDefendant([
          defendantPos.personPosition.lat,
          defendantPos.personPosition.lon,
        ]);
        setIspositionDefendant(true);
      } else {
        setPositionDefendant([0, 0]);
        setIspositionDefendant(false);
      }
      if (victimsDefendant && victimsDefendant.length > 0) {
        setVictims(victimsDefendant);
      } else {
        setVictims(null);
      }
    }
  }, [trackingDetail]);

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
        >
          <FullscreenControl
            position="topright"
            title="Fullscreen mode"
            titleCancel="Exit fullscreen mode"
            content={"[ ]"}
          />
          <FlyNewPosition
            positionDefendant={positionDefendant}
            defendantItem={defendantItem}
          />
          {victims?.map((victim) => {
            if (victim.personPosition) {
              return (
                <Marker
                  // icon={}
                  key={victim?.idPerson}
                  position={[
                    victim.personPosition.lat,
                    victim.personPosition.lon,
                  ]}
                  //ref={markerRef}
                >
                  <Popup>
                    <div className="flex flex-col gap-2">
                      <h1 className="text-primaryColor-700 text-center font-semibold">{`Victim: ${victim?.name} ${victim?.lastName}`}</h1>
                      <ul>
                        <li className="flex flex-row items-center gap-1">
                          <IconFeather.Heart size={10} color="red" />
                          <span>{`Cardio Frequency: ${victim?.personPosition.cardioFrequency}`}</span>
                        </li>

                        <li className="flex flex-row items-center gap-1">
                          <IconFeather.Battery size={10} color="green" />
                          <span>{`Battery: ${victim?.personPosition.battery}`}</span>
                        </li>
                        <li className="flex flex-row items-center gap-1">
                          <IconFeather.Calendar size={10} color="blue" />
                          <span>{`Date: ${dayjs
                            .utc(victim?.personPosition.positionDate)
                            .local()
                            .format("DD/MM/YYYY HH:mm:ss A")}`}</span>
                        </li>
                        <li className="flex flex-row items-center gap-1">
                          <IconFeather.Shield size={10} color="red" />
                          <span>{`Blood Oxygen: ${victim?.personPosition.bloodOxygen}`}</span>
                        </li>
                      </ul>
                    </div>
                  </Popup>
                </Marker>
              );
            } else return "";
          })}
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
              src={MapPositon}
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
