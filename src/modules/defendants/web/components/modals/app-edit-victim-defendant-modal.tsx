import { useEffect } from "react";
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import { useGetDefendantsById } from "../../hooks/use-get-defendants-by-id";
import * as Icon from "react-feather";
import { VictimForm } from "../forms/victim-form";
export type AppEditVictimDefendantModalProps = {
  isVisible: boolean;
  onClose: () => void;
  idDefendant?: number | null;
  //   onEditInfo: (param: string) => void;
};
export const AppEditVictimDefendantModal = ({
  isVisible,
  onClose,
  idDefendant,
}: //   onEditInfo,
AppEditVictimDefendantModalProps) => {
  const { defendant, getDefendantById } = useGetDefendantsById();
  useEffect(() => {
    if (idDefendant) getDefendantById({ idPerson: idDefendant });
  }, [idDefendant]);
  return (
    <Modal
      size="5xl"
      isOpen={isVisible}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 items-center">
            <Chip color="primary" variant="bordered">
              <div className="flex flex-row items-center jusitfy-center gap-3">
                <Icon.User size={15} />
                <span>
                  {`Defendant: ${defendant?.name} ${defendant?.lastName}`}
                </span>
              </div>
            </Chip>
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full p-5 gap-5">
            <Tabs
              color="warning"
              radius="md"
              className="w-full border"
              fullWidth
              variant="bordered"
            >
              <Tab
                key={"newVictim"}
                title={
                  <div className="flex items-center space-x-2">
                    <Icon.UserPlus size={18} />
                    <span>New Victim</span>
                  </div>
                }
              >
                <VictimForm
                  idDefendant={idDefendant}
                  defendantInfo={defendant}
                />
              </Tab>
              <Tab
                key={"existVictim"}
                title={
                  <div className="flex items-center space-x-2">
                    <Icon.User size={18} />
                    <span>Existing Victim</span>
                  </div>
                }
              ></Tab>
            </Tabs>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
};
