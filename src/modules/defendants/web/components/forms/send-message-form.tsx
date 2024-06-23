import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from "@nextui-org/react";
import { Phone } from "../../../domain/entities/phone";
import { useEffect, useState } from "react";
import { AppFormField } from "../../../../../presentation/Components/AppForm";
import { useSendMessage } from "../../hooks/use-send-message";
import { AppToast } from "../../../../../presentation/Components/AppToast";

export type SendMessageFormProps = {
  onClose: () => void;
  isVisible: boolean;
  selectedPhone?: Phone | null;
};
export const SendMessageForm = ({
  onClose,
  isVisible,
  selectedPhone,
}: SendMessageFormProps) => {
  const [message, setMessage] = useState<string>("");
  const { sendMessage, loading, error } = useSendMessage();
  const handleSubmit = async () => {
    if (selectedPhone) {
      await sendMessage({ mensaje: message, number: selectedPhone.phone });
    }
    if (!error) {
      AppToast().fire({
        title: "Sent Message",
        icon: "success",
        text: `The message to phone number ${selectedPhone?.phone} has been sent `,
      });
      onClose();
    }
  };
  useEffect(() => {
    if (error) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: `The message to phone number ${selectedPhone?.phone} has not been sent `,
      });
    }
    if (loading) {
      AppToast().fire({
        title: "Sending message",
        icon: "info",
        text: `The message to phone number ${selectedPhone?.phone} is being sent `,
      });
    }
  }, [error, loading]);
  useEffect(() => {
    return () => {
      setMessage("");
    };
  }, []);
  return (
    <Modal size="md" isOpen={isVisible} onClose={onClose} backdrop="blur">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 items-center"></ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full p-5 gap-5">
            <div className="text-primaryColor-800">
              {`Send message to: `}
              <span className="font-semibold">{selectedPhone?.phone}</span>
            </div>
            <AppFormField className="w-full">
              <Textarea
                name="message"
                label="Message"
                labelPlacement="outside"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="string"
                placeholder="Add message"
                radius="sm"
                variant="faded"
                size="md"
              />
            </AppFormField>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Cancel</Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isDisabled={loading}
              isLoading={loading}
            >
              Send
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
