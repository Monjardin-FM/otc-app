import { useEffect, useState } from "react";
import { AppVictimssTable } from "../../../../victim/web/components/app-victim-table";
import { useGetVictims } from "../../../../victim/web/hooks/use-get-victims";
import { AddVictimForm } from "./app-add-victim-form";
import { useToggle } from "react-use";
import { Disclosure } from "@headlessui/react";
import * as Icon from "react-feather";
import { AddressForm } from "./address-form";
import { AppAddressPersonsTable } from "../tables/app-address-person";
import { useGetAddressPerson } from "../../hooks/use-get-address-person";
import { Chip } from "@nextui-org/react";
import { AddressUpdateForm } from "./edit-addres-form";
import { useDeleteAddressPerson } from "../../hooks/use-delete-address-person";
import { EditVictimForm } from "./edit-victim-form";
import { useDeleteVictim } from "../../../../victim/web/hooks/use-delete-victim";
import { useGetVictimById } from "../../../../victim/web/hooks/use-get-victim-by-id";
import { DefendantById } from "../../../domain/entities/defendant-by-id";
import { AppToast } from "../../../../../presentation/Components/AppToast";
import { AppPhoneTable } from "../tables/app-phone-person-table";
import { useGetPhonePerson } from "../../hooks/use-get-phone";
import { useDeletePhonePerson } from "../../hooks/use-delete-phone";
import { PhoneForm } from "./phone-form";
// import { useAutoAnimate } from "@formkit/auto-animate/react";

type VictimFormProps = {
  idDefendant?: number | null;
  defendantInfo?: DefendantById;
};
export const VictimForm = ({ idDefendant, defendantInfo }: VictimFormProps) => {
  // const [parent] = useAutoAnimate();
  const [toggleReload, setToggleReload] = useToggle(false);
  const { getVictims, victims } = useGetVictims();
  const [idVictim, setIdVictim] = useState<number | null>();
  const [visibleFormAddress, setVisibleFormAddress] = useToggle(false);
  const { getVictimById, victim } = useGetVictimById();
  const [nameVictim, setNameVictim] = useState("");
  const [visibleTableAddress, setVisibleTableAddress] = useToggle(false);
  const [visibleEditAddress, setVisibleEditAddress] = useToggle(false);
  const [visibleEditVictimForm, setVisibleEditVictimForm] = useToggle(false);
  const [visibleFormPhone, setVisibleFormPhone] = useToggle(false);
  const { getPhonePerson, phonePerson } = useGetPhonePerson();
  const {
    deleteVictim,
    error: errorDeleteVictim,
    loading: loadingDeleteVictim,
  } = useDeleteVictim();
  const [idAddres, setIdAddress] = useState<number | null>();
  const { addressPerson, getAddressPerson } = useGetAddressPerson();
  const {
    deleteAddressPerson,
    error: errorDeleteAddress,
    loading: loadingDeleteAddress,
  } = useDeleteAddressPerson();
  const {
    deletePhonePerson,
    error: errorDeletePhone,
    loading: loadingDeletePhone,
  } = useDeletePhonePerson();

  const onDeleteAddress = () => {
    AppToast().fire({
      title: "Deleted Address",
      text: "The address was deleted succesfully",
      icon: "success",
    });
  };

  const onDelete = () => {
    AppToast().fire({
      title: "Deleted victim",
      text: "The victim was deleted succesfully",
      icon: "success",
    });
  };
  const onDeletePhone = () => {
    AppToast().fire({
      title: "Phone deleted",
      icon: "success",
      text: "The phone was deleted succesfully",
    });
  };
  useEffect(() => {
    if (idDefendant) getVictims({ idDefendant: idDefendant, completeName: "" });
  }, [toggleReload]);
  useEffect(() => {
    if (idVictim) {
      getAddressPerson({ idPerson: idVictim });
      getVictimById({ idPerson: idVictim, completeName: "" });
      getPhonePerson({ idPerson: idVictim });
    }
  }, [idVictim, toggleReload]);

  useEffect(() => {
    if (errorDeleteVictim) {
      AppToast().fire({
        title: "Error",
        text: "An error occurred while trying to delete the victim",
        icon: "error",
      });
    }
    if (loadingDeleteVictim) {
      AppToast().fire({
        title: "Deleting victim",
        text: "The victim is being  deleted. Please wait",
        icon: "info",
      });
    }
  }, [loadingDeleteVictim, errorDeleteVictim]);

  useEffect(() => {
    if (errorDeleteAddress) {
      AppToast().fire({
        title: "Error",
        text: "An error occurred while trying to delete the address",
        icon: "error",
      });
    }
    if (loadingDeleteAddress) {
      AppToast().fire({
        title: "Deleting address",
        text: "The address is being  deleted. Please wait",
        icon: "info",
      });
    }
  }, [loadingDeleteAddress, errorDeleteAddress]);
  useEffect(() => {
    if (errorDeletePhone) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the phone. Try again",
      });
    }
    if (loadingDeletePhone) {
      AppToast().fire({
        title: "Deleting phone",
        icon: "info",
        text: "The phone is being deleted. Please Wait",
      });
    }
  }, [errorDeletePhone, loadingDeletePhone]);
  return (
    <div
      // ref={parent}
      className="flex flex-col items-start justify-center gap-3"
    >
      <div className="w-full">
        <AddVictimForm
          idDefendant={idDefendant}
          onReload={() => {
            setToggleReload(!toggleReload);
          }}
        />
      </div>
      <div className="w-full mt-5">
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-info-100 px-4 py-2 text-left text-sm font-medium text-info-900 hover:bg-info-200 focus:outline-none focus-visible:ring focus-visible:primary">
                Victims
                <Icon.ChevronRight
                  className={open ? "rotate-90 transform" : ""}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="text-gray-500 ">
                <AppVictimssTable
                  onEdit={({ record }) => {
                    setIdVictim(record.idPerson);
                    setVisibleEditVictimForm(true);
                  }}
                  items={victims}
                  onAddAddress={(record) => {
                    setIdVictim(record.record.idPerson);
                    setNameVictim(
                      `${record.record.name} ${record.record.lastName}`
                    );
                    setVisibleFormAddress(true);
                    setVisibleFormPhone(false);

                    setToggleReload(!toggleReload);
                  }}
                  onAddPhone={(record) => {
                    setIdVictim(record.record.idPerson);
                    setVisibleFormPhone(true);
                    setVisibleFormAddress(false);
                    setNameVictim(
                      `${record.record.name} ${record.record.lastName}`
                    );
                    setToggleReload(!toggleReload);
                  }}
                  onShowAddress={(record) => {
                    setIdVictim(record.record.idPerson);
                    setNameVictim(
                      `${record.record.name} ${record.record.lastName}`
                    );
                    setVisibleTableAddress(true);
                  }}
                  onDelete={async (record) => {
                    await deleteVictim({ idPerson: record.record.idPerson });
                    if (!errorDeleteVictim) {
                      onDelete();
                    }
                    setToggleReload(!toggleReload);
                  }}
                  loadingDeleteVictim={loadingDeleteVictim}
                />
                {visibleEditVictimForm && (
                  <EditVictimForm
                    onReload={() => {
                      setToggleReload(!toggleReload);
                    }}
                    idDefendant={idDefendant}
                    idVictim={idVictim}
                    victimInfo={victim}
                    defendantInfo={defendantInfo}
                    onClose={() => {
                      setVisibleEditVictimForm(false);
                    }}
                  />
                )}
                {visibleTableAddress && (
                  <>
                    <div className="w-full bg-warn-100  p-2 rounded-lg ">
                      <span className="text-lg text-primaryColor-700 mb-5">
                        Address of {nameVictim}
                      </span>
                      <AppAddressPersonsTable
                        items={addressPerson}
                        onDelete={async ({ record }) => {
                          await deleteAddressPerson({
                            idAddress: record.idAddress,
                          });
                          if (!errorDeleteAddress) onDeleteAddress();
                          setToggleReload(!toggleReload);
                        }}
                        onEdit={({ record }) => {
                          setVisibleEditAddress(true);
                          setIdAddress(Number(record.idAddress));
                        }}
                        loadingDeleteAddress={loadingDeleteAddress}
                        isCreate={false}
                      />
                      <span className="text-lg text-primaryColor-700 mb-5">
                        Phone of {nameVictim}
                      </span>
                      <AppPhoneTable
                        isCreate={false}
                        loadingDeletePhone={loadingDeletePhone}
                        onDelete={async ({ record }) => {
                          await deletePhonePerson({
                            idPhone: record.idPhonePerson,
                          });
                          if (!errorDeletePhone) onDeletePhone();
                          setToggleReload(!toggleReload);
                        }}
                        items={phonePerson}
                        onEdit={() => {}}
                      />
                    </div>
                    {visibleEditAddress && (
                      <div className="col-span-12">
                        <AddressUpdateForm
                          isVisible={visibleEditAddress}
                          onClose={() => {
                            setVisibleEditAddress(false);
                          }}
                          onReload={() => {
                            setToggleReload(!toggleReload);
                          }}
                          idAddress={idAddres}
                        />
                      </div>
                    )}
                  </>
                )}
                {visibleFormAddress && (
                  <div className="flex flex-col items-center justify-center mt-5 gap-2">
                    <Chip
                      className="text-center"
                      variant="shadow"
                      color="primary"
                    >
                      Add address to {nameVictim}
                    </Chip>
                    <div className="w-full">
                      <AddressForm
                        onClose={() => {
                          setVisibleFormAddress(false);

                          // setIdVictim(null);
                        }}
                        onReload={() => {
                          setVisibleFormAddress(false);
                          setToggleReload(!toggleReload);
                        }}
                        idDefendant={idVictim}
                      />
                    </div>
                  </div>
                )}
                {visibleFormPhone && (
                  <div className="flex flex-col items-center justify-center mt-5 gap-2">
                    <Chip
                      className="text-center"
                      variant="shadow"
                      color="primary"
                    >
                      Add phone to {nameVictim}
                    </Chip>
                    <div className="w-full">
                      <PhoneForm
                        idDefendant={idVictim}
                        onReload={() => {
                          setToggleReload(!toggleReload);
                        }}
                        onClose={() => {
                          setVisibleFormPhone(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};
