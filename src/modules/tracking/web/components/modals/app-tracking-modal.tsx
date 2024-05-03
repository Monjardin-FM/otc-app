import { useEffect, useState } from "react";
import { useGetDetailTracking } from "../../hooks/use-get-detail-tracking";
import { AppTrackingDetailsTable } from "../tables/app-tracking-detail-table";
import { MapTracking } from "../maps/map-tracking";
import { useGetUsers } from "../../../../management-users/web/hooks/use-get-users";
import { UserManage } from "../../../../management-users/domain/entities/userManage";
import { PersonAlert } from "../../../domain/entities/tracking-detail";

import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from "@nextui-org/react";
import * as Icon from "react-feather";
import { AppHistoricPositionTab } from "./app-historic-position-tab";
export type AppTrackingModalProps = {
  isVisible: boolean;
  onClose: () => void;
};
export const AppTrackingModal = ({
  isVisible,
  onClose,
}: // toggle,
// personId,
AppTrackingModalProps) => {
  const { trackingDetail, getTrackingDetail } = useGetDetailTracking();
  const { getUsers, users } = useGetUsers();
  const [officer, setOfficer] = useState<UserManage | null>();
  const [alertPerson, setAlertPerson] = useState<PersonAlert[] | null>();
  // const { findHistoricPosition, historicPosition } = useFindHistoricPosition();
  const [userId, setUserId] = useState<number | null>();
  // Search Historic Position

  const handleClose = () => {
    setUserId(null);
    setAlertPerson([]);
    setOfficer(null);
    onClose();
  };

  // Get users to find the officer assigned to defendant
  useEffect(() => {
    getUsers({ completeName: "" });
  }, [userId]);
  // Filter to find the officer assigned to defendant
  useEffect(() => {
    if (users) {
      const officerFilter = users.find(
        (item) => item.idPerson === trackingDetail?.person[0].idOfficer
      );
      if (officerFilter) setOfficer(officerFilter);
    }
  }, [users]);

  // get the idDefendant
  useEffect(() => {
    const storedUserId = localStorage.getItem("trackingId");
    if (storedUserId) {
      setUserId(Number(storedUserId)); // Parseamos el valor a número
    }
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("trackingId");
    // getTrackingDetail({ personId: Number(storedUserId) });
    const fetchData = () => {
      if (storedUserId) {
        getTrackingDetail({ personId: Number(storedUserId) });
      }
    };
    if (isVisible) {
      // Realiza la petición inmediatamente al abrir el modal
      fetchData();
      const intervalId = setInterval(fetchData, 30000);
      // Retorna una función de limpieza para detener el intervalo cuando el componente se desmonte o la dependencia cambie
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isVisible]);

  // Function to assign the defendant alerts and pass to the table to display
  useEffect(() => {
    if (trackingDetail) {
      setAlertPerson(trackingDetail.personAlert);
    }
  }, [trackingDetail, userId]);

  return (
    <Modal
      isOpen={isVisible}
      onClose={handleClose}
      size="5xl"
      backdrop="blur"
      scrollBehavior="outside"
      isDismissable={false}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="grid grid-cols-12">
              <span className="col-span-3">Tracking Info</span>
            </ModalHeader>
            <ModalBody>
              <div className="w-full flex flex-row items-center justify-evenly mb-2">
                <Chip color="success" variant="shadow">
                  Defendant Name:{" "}
                  <b>
                    {trackingDetail &&
                      `${trackingDetail?.person[0].name} ${trackingDetail?.person[0].lastName} `}
                  </b>{" "}
                </Chip>
                <Chip color="primary" variant="dot">
                  Phone: <b>{}</b>
                </Chip>
                <Chip color="success" variant="dot">
                  Officer:
                  <b>{officer && ` ${officer?.name} ${officer?.lastName}`}</b>
                </Chip>
              </div>
              <Tabs
                aria-label="options"
                variant="bordered"
                fullWidth
                color="primary"
              >
                <Tab
                  key="livePosition"
                  title={
                    <div className="flex items-center space-x-2">
                      <Icon.MapPin size={18} />
                      <span>Live Position</span>
                    </div>
                  }
                >
                  <div>
                    <div className="w-full  rounded-lg bg-gray-200 mb-5">
                      <MapTracking
                        // historicPosition={historicPosition}
                        trackingDetail={trackingDetail}
                        onClose={onClose}
                      />
                    </div>

                    <div className="w-full mt-5">
                      <AppTrackingDetailsTable
                        onEdit={() => {}}
                        items={alertPerson}
                      />
                    </div>
                  </div>
                </Tab>
                <Tab
                  key="historicPosition"
                  title={
                    <div className="flex items-center space-x-2">
                      <Icon.Clock size={18} />
                      <span>Historic Position</span>
                    </div>
                  }
                >
                  <AppHistoricPositionTab />
                </Tab>
              </Tabs>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
