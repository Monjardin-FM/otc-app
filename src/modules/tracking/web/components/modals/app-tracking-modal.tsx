import { useEffect, useState } from "react";

import { useGetDetailTracking } from "../../hooks/use-get-detail-tracking";
import { AppTrackingDetailsTable } from "../tables/app-tracking-detail-table";
import { MapTracking } from "../maps/map-tracking";
import { useFindHistoricPosition } from "../../hooks/use-find-hsitoric-position";
import { useGetUsers } from "../../../../management-users/web/hooks/use-get-users";
import { UserManage } from "../../../../management-users/domain/entities/userManage";
import { PersonAlert } from "../../../domain/entities/tracking-detail";
import {
  AppModal,
  AppModalBody,
  AppModalCloseButton,
  AppModalContent,
  AppModalFooter,
  AppModalHeader,
  AppModalOverlay,
} from "../../../../../presentation/Components/AppModal";
import { AppBadge } from "../../../../../presentation/Components/AppBadge";
import { AppFormField } from "../../../../../presentation/Components/AppForm";
import AppDatePicker from "../../../../../presentation/Components/AppDatePicker";
import { AppButton } from "../../../../../presentation/Components/AppButton";
export type AppTrackingModalProps = {
  isVisible: boolean;
  onClose: () => void;
  // toggle: boolean;
  // personId?: number | null;
};
export const AppTrackingModal = ({
  isVisible,
  onClose,
}: // toggle,
// personId,
AppTrackingModalProps) => {
  const { trackingDetail, getTrackingDetail } = useGetDetailTracking();
  const { getUsers, users } = useGetUsers();
  const [officer, setOfficer] = useState<UserManage[]>();
  const [alertPerson, setAlertPerson] = useState<PersonAlert[]>();
  const { findHistoricPosition, historicPosition } = useFindHistoricPosition();
  const [userId, setUserId] = useState<number>();
  const onClick = () => {
    if (userId)
      findHistoricPosition({
        dateInit: "2024-04-23T00:08:46.000Z",
        dateFin: "2024-04-23T17:08:46.000Z",
        idPerson: userId,
      });
  };
  useEffect(() => {
    getUsers({ completeName: "" });
  }, [userId]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("trackingId");
    if (storedUserId) {
      setUserId(Number(storedUserId)); // Parseamos el valor a número
    }
  }, []);
  useEffect(() => {
    if (trackingDetail) {
      setAlertPerson(trackingDetail.personAlert);
    }
  }, [trackingDetail, userId]);
  useEffect(() => {
    if (users) {
      const officerFilter = users.filter(
        (item) => item.idPerson === trackingDetail?.person[0].idOfficer
      );
      if (officerFilter) setOfficer(officerFilter);
    }
  }, [users]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const storedUserId = localStorage.getItem("trackingId");

      if (storedUserId) {
        getTrackingDetail({ personId: Number(storedUserId) });
      }
    }, 30000);
    // Retorna una función de limpieza para detener el intervalo cuando el componente se desmonte o la dependencia cambie
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <AppModal isVisible={isVisible} onClose={onClose} size="full">
      <AppModalOverlay>
        <AppModalContent>
          <AppModalHeader className="w-full">
            Tracking Info
            <div className="w-full flex flex-row items-center justify-center absolute top-4">
              <AppBadge colorScheme="warn">
                Defendant Name:{" "}
                <b>{`${trackingDetail?.person[0].name} ${trackingDetail?.person[0].lastName} `}</b>{" "}
              </AppBadge>
              <AppBadge colorScheme="warn">
                Phone: <b>{}</b>
              </AppBadge>
              <AppBadge colorScheme="warn">
                Officer:
                <b>
                  {officer
                    ? ` ${officer[0]?.name} ${officer[0]?.lastName}`
                    : ""}
                </b>
              </AppBadge>
            </div>
            <AppModalCloseButton />
          </AppModalHeader>
          <AppModalBody>
            <div className="w-full  rounded-lg bg-gray-200">
              <MapTracking
                historicPosition={historicPosition}
                trackingDetail={trackingDetail}
              />
            </div>

            <div className="w-full flex flex-col items-center justify-center gap-5">
              <div className="flex flex-col items-start justify-start gap-3 border">
                <span className="font-bold ml-3 text-primary-700">
                  Historic Position
                </span>
                <div className="grid grid-cols-12 px-10 w-full  gap-3">
                  <AppFormField className="col-span-2">
                    <AppDatePicker
                      onChange={() => {}}
                      className="col-span-4"
                      placeholderText="From"
                    />
                  </AppFormField>
                  <AppFormField className="col-span-2">
                    <AppDatePicker
                      onChange={() => {}}
                      className="col-span-4"
                      placeholderText="To"
                    />
                  </AppFormField>
                  <AppButton colorScheme="primary" onClick={onClick}>
                    Search
                  </AppButton>
                </div>
              </div>
            </div>
            <div className="w-full mt-5">
              <AppTrackingDetailsTable onEdit={() => {}} items={alertPerson} />
            </div>
          </AppModalBody>
          <AppModalFooter></AppModalFooter>
        </AppModalContent>
      </AppModalOverlay>
    </AppModal>
  );
};
