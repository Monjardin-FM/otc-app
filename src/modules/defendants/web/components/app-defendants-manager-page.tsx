import { useEffect, useState } from "react";
import AppConfig from "../../../../settings.json";

import { AppDefendantsHeader } from "./app-defendants-header";
import * as Icon from "react-feather";
import { useToggle } from "react-use";
import { AppDefendantsTable } from "./tables/app-defendants-table";
import { AppNewDefendantModal } from "./modals/app-new-defendant-modal";
import { useGetDefendants } from "../hooks/use-get-defendants";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppLoading } from "../../../../presentation/Components/AppLoading";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import { Button, Tooltip } from "@nextui-org/react";
import { useDeleteDefendant } from "../hooks/use-delete-defendant";
import { AppToast } from "../../../../presentation/Components/AppToast";
import { AppEditSelectionModal } from "./modals/app-edit-selection-modal";
import { AppEditInfoDefendantModal } from "./modals/app-edit-info-defendant-modal";
import { AppEditVictimDefendantModal } from "./modals/app-edit-victim-defendant-modal";
import { AppEditAlarmDefendantModal } from "./modals/app-edit-alarm-defendant-modal";
import { AppAlarmsDefendantScheduleModal } from "./modals/app-alarms-defendant-schedule";
export const AppDefendantsManagerPage = () => {
  const {
    defendants,
    getDefendants,
    loading: loadingDefendants,
  } = useGetDefendants();
  const [toggleReload, setToggleReload] = useToggle(false);
  const [visibleNewDefendantModal, setVisibleNewDefendantModal] =
    useToggle(false);
  const [search, setSearch] = useState<string>("");
  const {
    deleteDefendant,
    error: errorDelete,
    loading: loadingDeleteDefendant,
  } = useDeleteDefendant();
  const [idDefendant, setIdDefendant] = useState<number | null>(null);
  const [visibleEditSelectionModal, setVIsibleEditSelectionmodal] =
    useToggle(false);
  const [visibleEditDefendantInfoModal, setVisibleEditDefendantInfoModal] =
    useToggle(false);
  const [visibleEditVictimDefendantModal, setVisibleEditVictimDefendantModal] =
    useToggle(false);
  const [visibleEditAlarmDefendantModal, setVisibleEditAlarmDefendantModal] =
    useToggle(false);
  const [visibleScheduleAlarmsModal, setVisibleScheduleAlarmsModal] =
    useToggle(false);
  const onClick = (search: string) => {
    getDefendants({ completeName: search });
  };
  const onDelete = () => {
    AppToast().fire({
      title: "Defendant deleted",
      icon: "success",
      text: "The defendant was deleted succesfully",
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
    getDefendants({ completeName: "" });
  }, [toggleReload]);
  useEffect(() => {
    if (errorDelete) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the defendant",
      });
    }
    if (loadingDeleteDefendant) {
      AppToast().fire({
        title: "Deleting Defendant",
        icon: "info",
        text: "The defendant is being deleted. Please wait",
      });
    }
  }, [errorDelete, loadingDeleteDefendant]);
  return (
    <AppAuthorizationGuard
      roles={AppConfig["defendants.managerPage.authorization"] as UserRole[]}
      redirect={{ to: "/" }}
    >
      {!defendants && <AppLoading />}
      <AppNewDefendantModal
        isVisible={visibleNewDefendantModal}
        onClose={() => setVisibleNewDefendantModal(false)}
        onReload={() => {
          setToggleReload(!toggleReload);
        }}
      />
      <AppEditSelectionModal
        isVisible={visibleEditSelectionModal}
        onClose={() => {
          setVIsibleEditSelectionmodal(false);
          setIdDefendant(null);
        }}
        onEditInfo={(param: string) => {
          switch (param) {
            case "editInfo": {
              setVIsibleEditSelectionmodal(false);
              setVisibleEditDefendantInfoModal(true);
              break;
            }

            case "victims": {
              setVIsibleEditSelectionmodal(false);
              setVisibleEditVictimDefendantModal(true);
              break;
            }
            case "editAlarm": {
              setVIsibleEditSelectionmodal(false);
              setVisibleEditAlarmDefendantModal(true);
              break;
            }
            case "scheduleAlarms": {
              setVIsibleEditSelectionmodal(false);
              setVisibleScheduleAlarmsModal(true);
              break;
            }
            default:
              return null;
          }
        }}
        idDefendant={idDefendant}
      />
      <AppEditInfoDefendantModal
        isVisible={visibleEditDefendantInfoModal}
        onClose={() => {
          setVisibleEditDefendantInfoModal(false);
          setVIsibleEditSelectionmodal(true);
          setToggleReload(!toggleReload);
        }}
        idDefendant={idDefendant}
      />
      <AppEditVictimDefendantModal
        isVisible={visibleEditVictimDefendantModal}
        onClose={() => {
          setVisibleEditVictimDefendantModal(false);
          setVIsibleEditSelectionmodal(true);
          setToggleReload(!toggleReload);
        }}
        idDefendant={idDefendant}
      />
      <AppEditAlarmDefendantModal
        isVisible={visibleEditAlarmDefendantModal}
        onClose={() => {
          setVisibleEditAlarmDefendantModal(false);
          setVIsibleEditSelectionmodal(true);
          setToggleReload(!toggleReload);
        }}
        idDefendant={idDefendant}
      />
      <AppAlarmsDefendantScheduleModal
        isVisible={visibleScheduleAlarmsModal}
        onClose={() => {
          setVisibleScheduleAlarmsModal(false);
          setVIsibleEditSelectionmodal(true);
          setToggleReload(!toggleReload);
        }}
        idDefendant={idDefendant}
      />
      <AppPageTransition>
        <div className="items-center mx-auto mb-10">
          <AppDefendantsHeader
            onClick={onClick}
            loadingDefendants={loadingDefendants}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center mt-5">
          <Tooltip
            content={"New Defendant"}
            color="warning"
            offset={1}
            showArrow
            closeDelay={10}
            style={{
              zIndex: 0,
            }}
            disableAnimation
          >
            <Button
              color="warning"
              onClick={() => setVisibleNewDefendantModal(true)}
              isIconOnly
              size="md"
            >
              <Icon.PlusCircle color="white" />
            </Button>
          </Tooltip>
        </div>
        <div className="container mx-auto mt-5 mb-14">
          <AppDefendantsTable
            onEdit={(record) => {
              setIdDefendant(record.record.idPerson);
              setVIsibleEditSelectionmodal(true);
            }}
            items={defendants}
            onDelete={async ({ record }) => {
              await deleteDefendant({ idPerson: record.idPerson });
              if (!errorDelete) onDelete();
              setToggleReload(!toggleReload);
            }}
            loadingDeleteDefendant={loadingDeleteDefendant}
          />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
