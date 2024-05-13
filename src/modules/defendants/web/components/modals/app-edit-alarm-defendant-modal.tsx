import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import * as Icon from "react-feather";
import { useGetDefendantsById } from "../../hooks/use-get-defendants-by-id";
import { AlarmForm } from "../forms/alarm-form";
import { AppAlarmDefendantsTable } from "../tables/app-defendant-alarm-table";
import { useGetDefendantAlarm } from "../../hooks/use-get-defendant-alarm";
import { useToggle } from "react-use";
import { useDeleteDefendantAlarm } from "../../hooks/use-delete-alarm.defendant";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { AppGeofenceView } from "../maps/app-geofence-view";
import { useGetDefendantAlarmById } from "../../hooks/use-get-alarm-defendant-by-id";
import { GeoJSONO } from "../../../domain/entities/geoJSON";
import { AppAlarmExceptionSchedulesTable } from "../tables/app-alarm-exception";
import { EditGeofenceForm } from "../forms/edit-geofence-form";
import {
  AlarmExceptionSchedule,
  Intervals,
  StrDays,
} from "../../../domain/entities/alarm-defendant";
export type AppEditAlarmDefendantModalProps = {
  isVisible: boolean;
  onClose: () => void;
  idDefendant?: number | null;
  //   onEditInfo: (param: string) => void;
};
export const AppEditAlarmDefendantModal = ({
  isVisible,
  onClose,
  idDefendant,
}: //   onEditInfo,
AppEditAlarmDefendantModalProps) => {
  const { defendant, getDefendantById } = useGetDefendantsById();
  const { defendantAlarm, getDefendantAlarm } = useGetDefendantAlarm();
  const [visibleAlarmForm, setVisibleAlarmForm] = useState(false);
  const [visibleMapGeofence, setVisibleMapGeofence] = useState(false);
  const [toggleReload, setToggleReload] = useToggle(false);
  const [idAlarmDefendant, setIdAlarmDefendant] = useState<number | null>();
  const [visibleEditGeofence, setVisibleEditGeofence] = useState(false);
  const {
    deleteDefendantAlarm,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteDefendantAlarm();
  const { defendantAlarmById, getDefendantAlarmById } =
    useGetDefendantAlarmById();
  const [geofence, setGeofence] = useState<any>();
  const [intervals, setIntervals] = useState<Intervals[]>();

  // useEffect to fetch defendant alarm
  useEffect(() => {
    if (idAlarmDefendant)
      getDefendantAlarmById({ idPersonSpecificAlarm: idAlarmDefendant });
  }, [idAlarmDefendant]);

  useEffect(() => {
    if (defendantAlarmById) {
      const geofenceJSON: GeoJSONO[] = defendantAlarmById?.lGeofence.map(
        (item) => JSON.parse(item.geofence)
      );
      // setVisibleMapGeofence(false);
      setGeofence(geofenceJSON);
    }
  }, [defendantAlarmById]);

  useEffect(() => {
    if (defendantAlarmById) {
      const itemsFilter: AlarmExceptionSchedule[] =
        defendantAlarmById?.alarmException?.filter(
          (item) => item.strDays !== "null"
        );
      const itemsSchedule: StrDays =
        itemsFilter && JSON.parse(itemsFilter[0]?.strDays);
      const itemsInterval = itemsSchedule && itemsSchedule.intervals;
      console.log(itemsInterval);
      setIntervals(itemsInterval);
    }
  }, [defendantAlarmById]);

  const onDelete = () => {
    AppToast().fire({
      title: "Alarm Defendant deleted",
      icon: "success",
      text: "The alarm defendant was deleted succesfully",
    });
  };

  useEffect(() => {
    if (idDefendant) {
      getDefendantById({ idPerson: idDefendant });
      getDefendantAlarm({ idPerson: idDefendant });
    }
  }, [idDefendant, toggleReload]);

  useEffect(() => {
    if (errorDelete) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the alarm",
      });
    }
    if (loadingDelete) {
      AppToast().fire({
        title: "Deleting",
        icon: "info",
        text: "The defendant alarm is being deleted. Please wait",
      });
    }
  }, [errorDelete, loadingDelete]);
  return (
    <Modal
      size="full"
      isOpen={isVisible}
      onClose={() => {
        onClose();
        setVisibleMapGeofence(false);
        setVisibleAlarmForm(false);
      }}
      backdrop="blur"
      // scrollBehavior="outside"
    >
      <ModalContent>
        {/* {(onClose) => ( */}
        <div className="overflow-auto">
          <ModalHeader className="flex flex-col items-center">
            <span className="text-primaryColor-700 absolute left-5">
              Edit Alarm Defendant
            </span>
            <Chip color="primary" variant="bordered" className="text-center">
              <div className="flex flex-row items-center jusitfy-center gap-3">
                <Icon.User size={15} />
                <span>
                  {`Defendant: ${defendant?.name} ${defendant?.lastName}`}
                </span>
              </div>
            </Chip>
          </ModalHeader>
          <ModalBody className="grid grid-cols-12 items-center justify-center w-full p-5 gap-5">
            <div className="col-span-12 flex flex-col items-end mx-16">
              <Button
                startContent={<Icon.Plus />}
                color="warning"
                onPress={() => {
                  setVisibleAlarmForm(true);
                  setVisibleMapGeofence(false);
                }}
              >
                New Alarm
              </Button>
            </div>
            <div className="col-span-12 mx-16">
              <AppAlarmDefendantsTable
                onDelete={async (record) => {
                  setVisibleMapGeofence(false);
                  await deleteDefendantAlarm({
                    idAlarmDefendant: record.record.idPersonSpecificAlarm,
                  });
                  if (!errorDelete) onDelete();
                  setToggleReload(!toggleReload);
                }}
                onView={async ({ record }) => {
                  setVisibleMapGeofence(false);
                  setVisibleAlarmForm(false);
                  setVisibleEditGeofence(false);
                  await getDefendantAlarmById({
                    idPersonSpecificAlarm: record.idPersonSpecificAlarm,
                  });
                  setIdAlarmDefendant(record.idPersonSpecificAlarm);
                  setVisibleMapGeofence(true);
                }}
                onEdit={async ({ record }) => {
                  setVisibleEditGeofence(true);
                  setVisibleAlarmForm(false);
                  setVisibleMapGeofence(false);
                  await getDefendantAlarmById({
                    idPersonSpecificAlarm: record.idPersonSpecificAlarm,
                  });
                  setIdAlarmDefendant(record.idPersonSpecificAlarm);
                  setVisibleEditGeofence(true);
                }}
                items={defendantAlarm}
                loadingDelete={loadingDelete}
              />
            </div>
            {visibleMapGeofence && (
              <div className="col-span-12 grid grid-cols-12 h-full gap-3 bg-info-100 p-3 rounded-lg items-start">
                <div className="col-span-5 flex flex-col items-center justify-center gap-4">
                  <span className="font-semibold text-primaryColor-700">
                    Schedules
                  </span>
                  <AppAlarmExceptionSchedulesTable items={intervals} />
                </div>
                <div className="col-span-7 flex flex-col items-end gap-2">
                  <AppGeofenceView geofence={geofence} />
                  <Button
                    color="danger"
                    onPress={() => setVisibleMapGeofence(false)}
                    className="self-end"
                  >
                    Hide Map
                  </Button>
                </div>
              </div>
            )}

            {visibleEditGeofence ? (
              <div className="col-span-12 border">
                <EditGeofenceForm
                  geofence={geofence}
                  items={defendantAlarmById?.alarmException}
                  idDefendant={idDefendant}
                  onReload={async () => {
                    if (defendantAlarmById?.idPersonSpecificAlarm) {
                      await deleteDefendantAlarm({
                        idAlarmDefendant:
                          defendantAlarmById?.idPersonSpecificAlarm,
                      });
                    }
                    setToggleReload(!toggleReload);
                  }}
                  onClose={() => setVisibleEditGeofence(false)}
                />
              </div>
            ) : (
              ""
            )}
            {visibleAlarmForm ? (
              <AlarmForm
                idDefendant={idDefendant}
                onClose={() => {
                  setVisibleAlarmForm(false);
                  setToggleReload(!toggleReload);
                }}
              />
            ) : (
              ""
            )}
          </ModalBody>
        </div>
        {/* )} */}
      </ModalContent>
    </Modal>
  );
};
