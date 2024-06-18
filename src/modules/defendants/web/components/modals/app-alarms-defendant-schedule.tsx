import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { AppAutomaticAlarmsDefendantTable } from "../tables/app-automatic-alarms";
import { useToggle } from "react-use";
import { ScheduleAlarDefendantForm } from "../forms/schedule-alarm-defendant-form";
import { useEffect, useState } from "react";
import { useGetAutomaticDefendantAlarm } from "../../hooks/use-get-automatic-alarms";
import { AutomaticAlarmsDefendant } from "../../../domain/entities/automatic-alarm-defendant";
import { AppScheduleAlarmsTable } from "../tables/app-schedules-alarms";
import { useGetScheduleAlarms } from "../../hooks/use-get-schedule-alarms";
import { useDeleteScheduleAlarm } from "../../hooks/use-delete-schedule-alarm";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { useGetDefendantAlarmDetail } from "../../hooks/use-get-alarm-detail";
import { EditDetailDefendantAlarmForm } from "../forms/edit-detail-defendant-alarm";

export type AppAlarmsDefendantScheduleModal = {
  isVisible: boolean;
  onClose: () => void;
  //   onReload: () => void;
  idDefendant: number | null;
};
export const AppAlarmsDefendantScheduleModal = ({
  isVisible,
  onClose,
  idDefendant,
}: //   onReload,
AppAlarmsDefendantScheduleModal) => {
  const [visibleScheduleForm, setVisibleScheduleForm] = useToggle(false);
  const [visibleScheduleTable, setVisibleScheduleTable] = useToggle(false);
  const [visibleDetailAlarmInfo, setVisibleDetailAlarmInfo] = useToggle(false);
  const [visibleEditDetailAlarm, setVisibleEditDetailAlarm] = useToggle(false);
  const { scheduleAlarms, getScheduleAlarms } = useGetScheduleAlarms();
  const [item, setItem] = useState<AutomaticAlarmsDefendant>();
  const [idAlarmType, setIdAlarmType] = useState<number>();
  const [toggleReload, setToggleReload] = useToggle(false);
  const { automaticDefendantAlarm, getAutomaticDefendantAlarm } =
    useGetAutomaticDefendantAlarm();
  const { defendantAlarmDetail, getDefendantAlarmDetail } =
    useGetDefendantAlarmDetail();
  const {
    deleteScheduleAlarm,
    error: errorDeleteScheduleAlarm,
    loading: loadingScheduleAlarm,
  } = useDeleteScheduleAlarm();
  useEffect(() => {
    if (idDefendant) getAutomaticDefendantAlarm({ idPerson: idDefendant });
  }, [idDefendant, toggleReload]);
  useEffect(() => {
    if (idDefendant && idAlarmType)
      getScheduleAlarms({ idAlarmType: idAlarmType, idDefendant: idDefendant });
  }, [idAlarmType, toggleReload]);
  useEffect(() => {
    if (errorDeleteScheduleAlarm) {
      AppToast().fire({
        title: "Error",
        text: "An error occurred while trying to delete the schedule alarm",
        icon: "error",
      });
    }
    if (loadingScheduleAlarm) {
      AppToast().fire({
        title: "Deleting",
        icon: "info",
        text: "The schedule alarm is being deleted. Please wait",
      });
    }
  }, [errorDeleteScheduleAlarm, loadingScheduleAlarm]);
  return (
    <Modal
      size="full"
      isOpen={isVisible}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <div className="overflow-auto">
            <ModalHeader>Alarms</ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full px-10">
                  <AppAutomaticAlarmsDefendantTable
                    onEdit={({ record }) => {
                      setItem(record);
                      setVisibleScheduleForm(true);
                      setIdAlarmType(record.idAlarmType);
                    }}
                    onView={({ record }) => {
                      setVisibleScheduleForm(false);
                      setVisibleScheduleTable(true);
                      setIdAlarmType(record.idAlarmType);
                      setItem(record);
                    }}
                    onViewAlarm={async ({ record }) => {
                      // setIdAlarmType(record.record.idAlarmType);
                      if (idDefendant)
                        await getDefendantAlarmDetail({
                          idAlarmType: record.idAlarmType,
                          idDefendant: idDefendant,
                        });
                      setVisibleDetailAlarmInfo(true);
                      setItem(record);
                    }}
                    onEditAlarm={async ({ record }) => {
                      if (idDefendant)
                        await getDefendantAlarmDetail({
                          idAlarmType: record.idAlarmType,
                          idDefendant: idDefendant,
                        });
                      setVisibleDetailAlarmInfo(true);
                      setItem(record);
                      setVisibleEditDetailAlarm(true);
                    }}
                    items={automaticDefendantAlarm}
                  />
                </div>
                {visibleScheduleForm && (
                  <ScheduleAlarDefendantForm
                    idDefendant={idDefendant}
                    idAlarmType={idAlarmType}
                    onClose={() => {
                      setVisibleScheduleForm(false);
                      setToggleReload(!toggleReload);
                    }}
                    item={item}
                  />
                )}
                {visibleScheduleTable && (
                  <div className="w-full px-10 flex flex-col mt-5">
                    <span className="text-lg text-center w-full font-semibold text-primaryColor-700">
                      {`Schedules of ${item?.description}`}
                    </span>
                    <AppScheduleAlarmsTable
                      onDelete={async ({ record }) => {
                        await deleteScheduleAlarm({ idAlarm: record.idAlarm });
                        if (!errorDeleteScheduleAlarm) {
                          AppToast().fire({
                            title: "Alarm Schedule Deleted",
                            icon: "success",
                            text: "The schedule alarm was deleted successfully",
                          });
                          setToggleReload(!toggleReload);
                        }
                      }}
                      items={scheduleAlarms}
                      loadingScheduleAlarm={loadingScheduleAlarm}
                    />
                  </div>
                )}
                <div className="flex flex-row items-start w-full container gap-5">
                  {visibleDetailAlarmInfo && (
                    <div className=" px-10 flex flex-col mt-5 bg-gray-200 rounded-lg w-1/2 p-5">
                      <span className="self-center font-semibold text-primaryColor-700">
                        {item?.description}
                      </span>
                      <ul>
                        <li className="flex flex-row items-center gap-2">
                          <span className="text-primaryColor-900 font-semibold">
                            Interval:
                          </span>
                          <span>{defendantAlarmDetail?.responseInterval}</span>
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <span className="text-primaryColor-900 font-semibold">
                            Geocoordinate Timeout:
                          </span>
                          <span>
                            {defendantAlarmDetail?.geocordinateTimeout}
                          </span>
                        </li>
                        <li className="flex flex-row items-center gap-2">
                          <span className="text-primaryColor-900 font-semibold">
                            Restraining Distance:
                          </span>
                          <span>{defendantAlarmDetail?.dynamicDistance}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  {visibleEditDetailAlarm && (
                    <div className="px-10 flex flex-col mt-5 bg-gray-200 rounded-lg w-1/2 p-5 gap-5">
                      <span className="self-center font-semibold text-primaryColor-700">
                        {item?.description}
                      </span>
                      <EditDetailDefendantAlarmForm
                        defendantAlarmDetail={defendantAlarmDetail}
                        idPerson={idDefendant}
                        selectedAlarm={item}
                        onClose={() => {
                          setVisibleEditDetailAlarm(false);
                          setVisibleDetailAlarmInfo(false);
                        }}
                        onReload={() => setToggleReload(!toggleReload)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" onPress={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
