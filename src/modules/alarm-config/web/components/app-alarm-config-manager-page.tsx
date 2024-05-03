import { useEffect, useState } from "react";
import AppConfig from "../../../../settings.json";
import { useToggle } from "react-use";
import * as Icon from "react-feather";
import { AppAlarmsHeader } from "./app-alarms-header";
import { AppNewAlarmModal } from "./modals/app-alarm-new-modal";
import { AppAlarmssTable } from "./tables/app-alarm-table";
import { useGetAlarms } from "../hooks/use-get-alarms";
import { AppEditAlarmModal } from "./modals/app-alarm-edit-modal";
import { useDeleteAlarm } from "../hooks/use-delete-alarm";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppLoading } from "../../../../presentation/Components/AppLoading";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import { AppButton } from "../../../../presentation/Components/AppButton";
import { AppTooltip } from "../../../../presentation/Components/AppTooltip";
import { AppToast } from "../../../../presentation/Components/AppToast";

export const AppAlarmConfigManagerPage = () => {
  const [visibleNewAlarmModal, setVisibleNewAlarmModal] = useToggle(false);
  const [visibleEditAlarmModal, setVisibleEditAlarmModal] = useToggle(false);
  const [toggleReload, setToggleReload] = useToggle(false);
  const { alarms, getAlarms, loading: loadingAlarms } = useGetAlarms();
  const { deleteAlarm, error: errorDelete } = useDeleteAlarm();
  const [idAlarm, setIdAlarm] = useState<number | null>();
  const [search, setSearch] = useState<string>("");
  const onClick = (search: string) => {
    getAlarms({ completeName: search });
  };
  const onDelete = () => {
    AppToast().fire({
      title: "Alarm deleted",
      icon: "success",
      text: "The alarm was deleted succesfully",
    });
  };
  useEffect(() => {
    if (search.length > 1 || search.length === 0) {
      const timeDelay = setTimeout(() => {
        onClick(search);
      }, 500);
      return () => clearTimeout(timeDelay);
    }
  }, [search, toggleReload]);

  useEffect(() => {
    getAlarms({ completeName: "" });
  }, [toggleReload]);
  useEffect(() => {
    if (errorDelete) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the user",
      });
    }
  }, [errorDelete]);
  return (
    <AppAuthorizationGuard
      roles={
        AppConfig["userManagement.managerPage.authorization"] as UserRole[]
      }
      redirect={{ to: "/" }}
    >
      {!alarms && <AppLoading />}
      <AppNewAlarmModal
        isVisible={visibleNewAlarmModal}
        onClose={() => setVisibleNewAlarmModal(false)}
        onReload={() => setToggleReload(!toggleReload)}
      />
      <AppEditAlarmModal
        isVisible={visibleEditAlarmModal}
        onClose={() => setVisibleEditAlarmModal(false)}
        onReload={() => setToggleReload(!toggleReload)}
        idAlarm={idAlarm}
      />
      <AppPageTransition>
        <div className="items-center mx-auto mb-5">
          <AppAlarmsHeader
            onClick={onClick}
            loadingAlarms={loadingAlarms}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center">
          <div className="group relative inline-block text-center">
            <AppButton
              colorScheme="warn"
              onClick={() => setVisibleNewAlarmModal(true)}
            >
              <Icon.PlusCircle />
            </AppButton>
            <AppTooltip>New Alarm</AppTooltip>
          </div>
        </div>
        <div className="container mx-auto mt-5">
          <AppAlarmssTable
            onEdit={({ record }) => {
              setIdAlarm(record.idAlarmType);
              setVisibleEditAlarmModal(true);
            }}
            onDelete={async (record) => {
              if (record.record.idAlarmType) {
                await deleteAlarm({ idAlarmType: record.record.idAlarmType });
                if (!errorDelete) onDelete();
              }
              setToggleReload(!toggleReload);
            }}
            items={alarms}
          />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
