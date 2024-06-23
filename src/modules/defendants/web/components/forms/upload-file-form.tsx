import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { ChangeEvent, useEffect, useState } from "react";
import { useUploadFile } from "../../hooks/use-upload-file";
import { AppToast } from "../../../../../presentation/Components/AppToast";
export type UploadFileFormProps = {
  onClose: () => void;
  isVisible: boolean;
  idDefendant?: number | null;
};
export const UploadFileForm = ({
  isVisible,
  onClose,
  idDefendant,
}: UploadFileFormProps) => {
  const [fileBase64String, setFileBase64String] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<string>("");
  const { uploadFile, loading, error } = useUploadFile();
  const encodeFileBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length === 1) {
      setFileName(files[0].name);
      const file = files[0];
      const extension = file.name.split(".").pop();
      setFileExtension(extension ? `.${extension}` : "");
      const base64 = await encodeFileBase64(file);
      const split64 = base64.split(",").pop();
      //   console.log(split64);
      if (split64) setFileBase64String(split64);
    }
  };
  const handleSubmit = async () => {
    console.log(idDefendant);
    console.log(fileExtension);
    console.log(fileBase64String);
    console.log(fileName);
    if (fileName && idDefendant) {
      await uploadFile({
        extension: fileExtension,
        file: fileBase64String,
        idPerson: idDefendant,
      });
    }
    if (!error) {
      AppToast().fire({
        title: "Uploaded file",
        icon: "success",
        text: `The file has been uploaded successfully`,
      });
      onClose();
    }
  };
  useEffect(() => {
    if (error) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: `The file has not been uploaded `,
      });
    }
    if (loading) {
      AppToast().fire({
        title: "Sending message",
        icon: "info",
        text: `The file is being uploaded `,
      });
    }
  }, [error, loading]);
  return (
    <Modal size="md" isOpen={isVisible} onClose={onClose} backdrop="blur">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 items-center">
            Upload File
          </ModalHeader>
          <ModalBody className="flex flex-col items-center justify-center w-full p-5 gap-5">
            <div className="w-full">
              <input
                type="file"
                onChange={onFileChange}
                className="w-full border border-primaryColor-800 inline-block p-10 cursor-pointer bg-primaryColor-100 rounded-lg "
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Cancel</Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isDisabled={loading || !fileName}
              isLoading={loading}
            >
              Upload file
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};
