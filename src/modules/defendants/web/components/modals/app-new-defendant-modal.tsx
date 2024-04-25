import { useEffect, useState } from "react";

import { DefendantForm } from "../forms/defendant-form";
import { VictimForm } from "../forms/victim-form";
import { AlarmForm } from "../forms/alarm-form";
import { ReferenceForm } from "../forms/reference-from";
import { useCreateDefendant } from "../../hooks/use-create-defendant";
import { Tab } from "@headlessui/react";
import { useGetDefendantsById } from "../../hooks/use-get-defendants-by-id";
import { createDefendantParams } from "../../../domain/repositories/defendant-repository";
import { AppToast } from "../../../../../presentation/Components/AppToast";
// import {
//   AppModal,
//   AppModalBody,
//   AppModalCloseButton,
//   AppModalContent,
//   AppModalHeader,
//   AppModalOverlay,
// } from "../../../../../presentation/Components/AppModal";
import { AppBadge } from "../../../../../presentation/Components/AppBadge";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/react";
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
export type AppNewDefendantModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onReload: () => void;
};

export const AppNewDefendantModal = ({
  isVisible,
  onClose,
  onReload,
}: AppNewDefendantModalProps) => {
  const {
    createDefendant,
    value,
    loading: loadingDefendant,
    error: errorDefendant,
  } = useCreateDefendant();
  const [isCreatedDefendant, setIsCreatedDefendant] = useState(false);
  const [idDefendant, setIdDefendant] = useState<number>();
  const { getDefendantById, defendant } = useGetDefendantsById();

  const onCreateDefendant = async (params: createDefendantParams) => {
    const id = await createDefendant(params);
    if (!errorDefendant) {
      AppToast().fire({
        title: "Success",
        text: "The defendant was created successfully",
        icon: "success",
      });
    }
    onReload();
    if (id) setIdDefendant(id);
    setIsCreatedDefendant(true);
  };

  useEffect(() => {
    setIdDefendant(value);
  }, [value]);
  useEffect(() => {
    if (idDefendant) getDefendantById({ idPerson: idDefendant });
  }, [idDefendant]);
  return (
    <Modal
      size="full"
      isOpen={isVisible}
      onClose={onClose}
      scrollBehavior={"inside"}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              New Defendant
              <div className="flex flex-row items-center justify-evenly gap-5 ">
                <span>
                  <AppBadge colorScheme="warn">
                    Defendant Name:{" "}
                    {defendant
                      ? `${defendant?.name} ${defendant?.lastName} `
                      : ""}
                  </AppBadge>
                </span>
                <span>
                  <AppBadge colorScheme="warn">SID: {defendant?.sid}</AppBadge>
                </span>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="w-full px-2 py-16">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl border border-primary-100 p-1">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                          "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
                          selected
                            ? "bg-info-500 text-white shadow"
                            : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
                        )
                      }
                    >
                      Defendant
                    </Tab>
                    <Tab
                      disabled={!isCreatedDefendant}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                          "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
                          selected
                            ? "bg-info-500 text-white shadow"
                            : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
                        )
                      }
                    >
                      Victims
                    </Tab>
                    <Tab
                      // disabled={!isCreatedDefendant}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                          "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
                          selected
                            ? "bg-info-500 text-white shadow"
                            : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
                        )
                      }
                    >
                      Alarms
                    </Tab>
                    <Tab
                      disabled={!isCreatedDefendant}
                      className={({ selected }) =>
                        classNames(
                          "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                          "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
                          selected
                            ? "bg-info-500 text-white shadow"
                            : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
                        )
                      }
                    >
                      Reference Contacts
                    </Tab>
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <DefendantForm
                        onCreateDefendant={onCreateDefendant}
                        onClose={onClose}
                        isCreatedDefendant={isCreatedDefendant}
                        idDefendant={idDefendant}
                        loadingDefendant={loadingDefendant}
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <VictimForm idDefendant={idDefendant} />
                    </Tab.Panel>
                    <Tab.Panel>
                      <AlarmForm />
                    </Tab.Panel>
                    <Tab.Panel>
                      <ReferenceForm />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
    // <AppModal isVisible={isVisible} onClose={onClose} size="full">
    //   <AppModalOverlay>
    //     <AppModalContent>
    //       <AppModalHeader>
    //         <AppModalCloseButton />
    //         <div className="flex flex-row items-center justify-evenly gap-5 ">
    //           <span>New Defendant</span>
    //           <span>
    //             <AppBadge colorScheme="warn">
    //               Defendant Name:{" "}
    //               {defendant
    //                 ? `${defendant?.name} ${defendant?.lastName} `
    //                 : ""}
    //             </AppBadge>
    //           </span>
    //           <span>
    //             <AppBadge colorScheme="warn">SID: {defendant?.sid}</AppBadge>
    //           </span>
    //         </div>
    //       </AppModalHeader>
    //       <AppModalBody>
    //         <div className="w-full px-2 py-16">
    //           <Tab.Group>
    //             <Tab.List className="flex space-x-1 rounded-xl border border-primary-100 p-1">
    //               <Tab
    //                 className={({ selected }) =>
    //                   classNames(
    //                     "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
    //                     "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
    //                     selected
    //                       ? "bg-info-500 text-white shadow"
    //                       : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
    //                   )
    //                 }
    //               >
    //                 Defendant
    //               </Tab>
    //               <Tab
    //                 disabled={!isCreatedDefendant}
    //                 className={({ selected }) =>
    //                   classNames(
    //                     "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
    //                     "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
    //                     selected
    //                       ? "bg-info-500 text-white shadow"
    //                       : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
    //                   )
    //                 }
    //               >
    //                 Victims
    //               </Tab>
    //               <Tab
    //                 // disabled={!isCreatedDefendant}
    //                 className={({ selected }) =>
    //                   classNames(
    //                     "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
    //                     "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
    //                     selected
    //                       ? "bg-info-500 text-white shadow"
    //                       : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
    //                   )
    //                 }
    //               >
    //                 Alarms
    //               </Tab>
    //               <Tab
    //                 disabled={!isCreatedDefendant}
    //                 className={({ selected }) =>
    //                   classNames(
    //                     "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
    //                     "ring-white ring-offset-2 ring-offset-info-100 focus:outline-none focus:ring-2",
    //                     selected
    //                       ? "bg-info-500 text-white shadow"
    //                       : "text-info-600 hover:bg-white hover:text-info-600 transition-all duration-150"
    //                   )
    //                 }
    //               >
    //                 Reference Contacts
    //               </Tab>
    //             </Tab.List>
    //             <Tab.Panels>
    //               <Tab.Panel>
    //                 <DefendantForm
    //                   onCreateDefendant={onCreateDefendant}
    //                   onClose={onClose}
    //                   isCreatedDefendant={isCreatedDefendant}
    //                   idDefendant={idDefendant}
    //                   loadingDefendant={loadingDefendant}
    //                 />
    //               </Tab.Panel>
    //               <Tab.Panel>
    //                 <VictimForm idDefendant={idDefendant} />
    //               </Tab.Panel>
    //               <Tab.Panel>
    //                 <AlarmForm />
    //               </Tab.Panel>
    //               <Tab.Panel>
    //                 <ReferenceForm />
    //               </Tab.Panel>
    //             </Tab.Panels>
    //           </Tab.Group>
    //         </div>
    //       </AppModalBody>
    //     </AppModalContent>
    //   </AppModalOverlay>
    // </AppModal>
  );
};
