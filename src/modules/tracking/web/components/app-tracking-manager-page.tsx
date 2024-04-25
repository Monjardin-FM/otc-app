import { useEffect, useState } from "react";
import AppConfig from "../../../../settings.json";
import { AppTrackingHeader } from "./app-tracking-header";
import { AppTrackingsTable } from "./tables/app-tracking-table";
import { AppTrackingModal } from "./modals/app-tracking-modal";
import { useToggle } from "react-use";
import { useGetTracking } from "../hooks/use-get-tracking";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppLoading } from "../../../../presentation/Components/AppLoading";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";

export const AppTrackingManagerPage = () => {
  const [visibleTrackingModal, setVisibleTrackingModal] = useToggle(false);
  const { tracking, getTracking } = useGetTracking();
  const [trackingId, setTrackingId] = useState<number | null>();
  useEffect(() => {
    const intervalId = setInterval(() => {
      getTracking();
    }, 3000);

    // Retorna una función de limpieza para detener el intervalo cuando el componente se desmonte o la dependencia cambie
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    console.log(trackingId);
  }, [trackingId]);

  return (
    <AppAuthorizationGuard
      roles={
        AppConfig["userManagement.managerPage.authorization"] as UserRole[]
      }
      redirect={{ to: "/" }}
    >
      {!tracking && <AppLoading />}
      <AppTrackingModal
        isVisible={visibleTrackingModal}
        onClose={() => setVisibleTrackingModal(false)}
        personId={trackingId}
      />
      <AppPageTransition>
        <div className="items-center mx-auto mb-5">
          <AppTrackingHeader
            // setTrackingId={setTrackingId}
            onSearch={(id: number | undefined) => {
              setTrackingId(id);
              setVisibleTrackingModal(true);
            }}
          />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center"></div>
        <div className="container mx-auto mt-5">
          <AppTrackingsTable
            onEdit={({ record }) => {
              setTrackingId(record.personId);
              setVisibleTrackingModal(true);
            }}
            items={tracking}
          />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
