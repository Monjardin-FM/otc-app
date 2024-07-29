import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useCreateCommentDefendant } from "../../hooks/comment/use-create-comment-defendant";
import { FormEvent, useState } from "react";
import * as Icon from "react-feather";
type AppAddNoteDefendantModalProps = {
  isVisible: boolean;
  onClose: () => void;
  idDefendant?: number | null;
};

export const AppAddNoteDefendantModal = ({
  isVisible,
  onClose,
  idDefendant,
}: AppAddNoteDefendantModalProps) => {
  const [comment, setComment] = useState<string>("");
  const { createCommentDefendant, loading } = useCreateCommentDefendant();
  //   const handleChange = (event: ChangeEventHandler<HTMLInputElement>) => {
  //     setComment(event);
  //   };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (idDefendant) {
      await createCommentDefendant({
        idDefendant: idDefendant,
        message: comment,
      });
    }
  };
  return (
    <Modal size="md" isOpen={isVisible} onClose={onClose} backdrop="blur">
      <ModalContent>
        <>
          <ModalHeader>Add Note</ModalHeader>
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Textarea
                id="comment"
                value={comment}
                isRequired
                label="Comment"
                labelPlacement="outside"
                placeholder="Enter your comment"
                className="w-full"
                errorMessage={"Required"}
                // onChange={handleChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button onPress={onClose} variant="light">
                Cancelar
              </Button>
              <Button
                type="submit"
                color="primary"
                startContent={<Icon.Save size={15} />}
                isDisabled={loading}
                isLoading={loading}
              >
                Save
              </Button>
            </ModalFooter>
          </form>
        </>
      </ModalContent>
    </Modal>
  );
};
