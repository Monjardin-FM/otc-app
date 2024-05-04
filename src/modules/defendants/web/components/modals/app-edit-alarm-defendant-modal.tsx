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
  const [toggleReload, setToggleReload] = useToggle(false);
  const {
    deleteDefendantAlarm,
    loading,
    error: errorDelete,
  } = useDeleteDefendantAlarm();
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
  }, [errorDelete]);
  return (
    <Modal
      size="full"
      isOpen={isVisible}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        {/* {(onClose) => ( */}
        <div className="overflow-auto">
          <ModalHeader className="flex flex-col gap-1 items-center relative">
            <span className="text-primaryColor-700 absolute left-5">
              Edit Alarm Defendant
            </span>
            <Chip color="primary" variant="bordered">
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
                onPress={() => setVisibleAlarmForm(true)}
              >
                New Alarm
              </Button>
            </div>
            <div className="col-span-12 mx-16">
              <AppAlarmDefendantsTable
                onDelete={async (record) => {
                  await deleteDefendantAlarm({
                    idAlarmDefendant: record.record.idPersonSpecificAlarm,
                  });
                  if (!errorDelete) onDelete();
                  setToggleReload(!toggleReload);
                }}
                items={defendantAlarm}
              />
            </div>
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
