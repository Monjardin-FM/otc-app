import { useEffect } from "react";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
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
      size="full"
      isOpen={isVisible}
      onClose={onClose}
      backdrop="blur"
      scrollBehavior="outside"
    >
      <ModalContent>
        {(onClose) => (
          <div className="overflow-auto">
            <ModalHeader className="flex flex-col gap-5 items-center">
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
              <VictimForm idDefendant={idDefendant} defendantInfo={defendant} />
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose}>Cancel</Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
