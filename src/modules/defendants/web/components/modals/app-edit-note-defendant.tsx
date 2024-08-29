import { FormEvent, useEffect, useState } from "react";
import { useUpdateCommentDefendant } from "../../hooks/comment/use-update-comment-defendant";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { useGetCommentDefendant } from "../../hooks/comment/use-get-comment-defendant";
import * as Icon from "react-feather";
type AppEditNoteDefendantModalProps = {
  isVisible: boolean;
  onClose: () => void;
  idDefendant?: number | null;
};

export const AppEditNoteDefendantModal = ({
  isVisible,
  onClose,
  idDefendant,
}: AppEditNoteDefendantModalProps) => {
  const [comment, setComment] = useState<string>("");
  const { updateCommentDefendant, loading, error } =
    useUpdateCommentDefendant();
  const { commentDefendant, getCommentDefendant } = useGetCommentDefendant();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (idDefendant) {
      event.preventDefault();
      await updateCommentDefendant({
        idDefendant: idDefendant,
        comment: comment,
      });
    }
    if (!error) {
      AppToast().fire({
        title: "Note Saved",
        icon: "success",
        text: "The note was saved successfully",
      });
      onClose();
    }
  };
  useEffect(() => {
    if (error) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to update defendant note. Try again",
      });
    }
    if (loading) {
      AppToast().fire({
        title: "Updatting note",
        icon: "info",
        text: "The note is being saved. Please Wait",
      });
    }
  }, [error, loading]);
  useEffect(() => {
    if (idDefendant) {
      getCommentDefendant({ idPerson: idDefendant });
    }
  }, [idDefendant]);
  useEffect(() => {
    if (commentDefendant) {
      setComment(commentDefendant.comment);
    }
    return () => {
      setComment("");
    };
  }, [commentDefendant]);
  return (
    <Modal size="md" isOpen={isVisible} onClose={onClose} backdrop="blur">
      <ModalContent>
        <>
          <ModalHeader>Edit Note</ModalHeader>
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
                onValueChange={setComment}
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
