import { AppFormField } from "../../../../../presentation/Components/AppForm";
import AppDatePicker from "../../../../../presentation/Components/AppDatePicker";
import { Button } from "@nextui-org/react";
import { MapHistoricPosition } from "../maps/map-historic-position";
import { useFindHistoricPosition } from "../../hooks/use-find-hsitoric-position";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { HistoricPosition } from "../../../domain/entities/historic-position";

export const AppHistoricPositionTab = () => {
  const [dateInitSearch, setDateInitSearch] = useState<string>();
  const [dateFinishSearch, setDateFinishSearch] = useState<string>();
  const [dateInit, setDateInit] = useState<Date>(new Date());
  const [dateFinish, setDateFinish] = useState<Date>(new Date());
  const [userId, setUserId] = useState<number | null>();
  const { findHistoricPosition, historicPosition, loading } =
    useFindHistoricPosition();
  const [positions, setPositions] = useState<HistoricPosition[]>([]);
  const handleSubmit = async () => {
    if (userId)
      await findHistoricPosition({
        dateInit: dateInitSearch ?? "",
        dateFin: dateFinishSearch ?? "",
        idPerson: userId,
      });
  };
  useEffect(() => {
    if (historicPosition && historicPosition.length > 0) {
      setPositions(historicPosition);
    }
  }, [historicPosition]);
  useEffect(() => {
    setDateInitSearch(dayjs(dateInit.getTime()).toISOString());
    setDateFinishSearch(dayjs(dateFinish.getTime()).toISOString());
  }, [dateInit, setDateFinish]);
  useEffect(() => {
    const storedUserId = localStorage.getItem("trackingId");
    if (storedUserId) setUserId(Number(storedUserId));
  }, []);
  return (
    <div className="w-full flex flex-row items-start justify-center ">
      <div className="flex flex-col text-center items-center w-2/5  gap-3 z-50">
        <AppFormField className="col-span-4">
          <AppDatePicker
            selected={dateInit}
            onChange={(date) => {
              if (date instanceof Date) setDateInit(date);
            }}
            className="col-span-4"
            placeholderText="From"
            showTimeInput
            dateFormat="MMMM d, yyyy h:mm aa"
            inline
          />
        </AppFormField>
        <AppFormField className="col-span-4">
          <AppDatePicker
            selected={dateFinish}
            onChange={(date) => {
              if (date instanceof Date) {
                setDateFinish(date);
              }
            }}
            className="col-span-4"
            placeholderText="From"
            showTimeInput
            dateFormat="MMMM d, yyyy h:mm aa"
            inline
          />
        </AppFormField>
        <Button
          color="primary"
          className="w-1/2 tex-center"
          onClick={handleSubmit}
          isDisabled={loading}
          isLoading={loading}
        >
          Search
        </Button>
      </div>

      <div className=" w-3/5 rounded-lg bg-gray-200 mb-5">
        <MapHistoricPosition historicPosition={positions} />
      </div>
    </div>
  );
};
