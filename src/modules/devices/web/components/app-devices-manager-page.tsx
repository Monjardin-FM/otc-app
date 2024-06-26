import { useEffect, useState } from "react";
import AppConfig from "../../../../settings.json";
import { AppDevicesHeader } from "./app-devices-header";
import * as Icon from "react-feather";
import { useToggle } from "react-use";
import { AppNewDeviceModal } from "./modals/app-new-device-modal";
import { AppDevicessTable } from "./tables/app-device-table";
import { useGetDevices } from "../hooks/use-get-devices";
import { AppEditDeviceModal } from "./modals/app-edit-device";
import { useDeleteDevice } from "../hooks/use-delete-device";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppLoading } from "../../../../presentation/Components/AppLoading";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import { Button, Tooltip } from "@nextui-org/react";

export const AppDevicesManagerPage = () => {
  const [visibleNewDeviceModal, setVisibleNewDeviceModal] = useToggle(false);
  const [visibleEditDeviceModal, setVisibleEditDeviceModal] = useToggle(false);
  const [idDevice, setIdDevice] = useState<number>();
  const { devices, getDevices, loading: loadingDevices } = useGetDevices();
  const [toggleReload, setToggleReload] = useToggle(false);
  const { deleteDevice, loading: loadingDeleteDevice } = useDeleteDevice();
  const onClick = (search: string) => {
    getDevices({ completeName: search });
  };
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    if (search.length > 1 || search.length === 0) {
      const timeDelay = setTimeout(() => {
        onClick(search);
      }, 500);
      return () => clearTimeout(timeDelay);
    }
  }, [search, toggleReload]);
  useEffect(() => {
    getDevices({ completeName: "" });
  }, [toggleReload]);
  return (
    <AppAuthorizationGuard
      roles={AppConfig["devices.managerPage.authorization"] as UserRole[]}
      redirect={{ to: "/" }}
    >
      {!devices && <AppLoading />}
      <AppNewDeviceModal
        isVisible={visibleNewDeviceModal}
        onClose={() => setVisibleNewDeviceModal(false)}
        onReload={() => setToggleReload(!toggleReload)}
      />
      <AppEditDeviceModal
        isVisible={visibleEditDeviceModal}
        onClose={() => setVisibleEditDeviceModal(false)}
        onReload={() => setToggleReload(!toggleReload)}
        idDevice={idDevice}
      />
      <AppPageTransition>
        <div className="items-center mx-auto mb-5">
          <AppDevicesHeader
            onClick={onClick}
            loadingDevices={loadingDevices}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center">
          <Tooltip
            content={"New Device"}
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
              onClick={() => setVisibleNewDeviceModal(true)}
              isIconOnly
              size="md"
            >
              <Icon.PlusCircle color="white" />
            </Button>
          </Tooltip>
        </div>
        <div className="container mx-auto mt-5">
          <AppDevicessTable
            onEdit={(record) => {
              setIdDevice(record.record.idDevice);
              setVisibleEditDeviceModal(true);
            }}
            onDelete={async (record) => {
              if (record.record.idDevice) {
                await deleteDevice({ idDevice: record.record.idDevice });
              }
              setToggleReload(!toggleReload);
            }}
            items={devices}
            loadingDeleteDevice={loadingDeleteDevice}
          />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
