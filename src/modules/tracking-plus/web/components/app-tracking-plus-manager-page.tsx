import { useEffect } from "react";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import AppConfig from "../../../../settings.json";
import { UserRole } from "../../../user/domain/entities/user-role";
import { useGetTrackingPlus } from "../hooks/use-get-tracking-plus";
import { useShowAlerts } from "../hooks/use-show-alerts";
import { AppTrackingPlusHeader } from "./app-tracking-plus-header";
import { AppTrackingPlussTable } from "./tables/app-tracking-plus-table";
import { AppToast } from "../../../../presentation/Components/AppToast";

export const AppTrackingPlusManagerPage = () => {
  const { getTrackingPlus, trackingPlus } = useGetTrackingPlus();
  const {
    showAlerts,
    loading: loadingShowAlerts,
    error: errorShowAlert,
  } = useShowAlerts();

  const handleShowAlert = async (idPerson: number) => {
    await showAlerts({ idPerson: idPerson, showalerts: true });
    if (!errorShowAlert) {
      AppToast().fire({
        title: "Success",
        icon: "success",
        text: "Action completed",
      });
    }
  };

  useEffect(() => {
    if (errorShowAlert) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error has occurred",
      });
    }
  }, [errorShowAlert]);

  useEffect(() => {
    getTrackingPlus();
    const intervalId = setInterval(() => {
      const fetchData = () => {
        getTrackingPlus();
      };
      fetchData();
    }, 30000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  return (
    <div>
      <AppAuthorizationGuard
        roles={
          AppConfig["userManagement.managerPage.authorization"] as UserRole[]
        }
        redirect={{ to: "/" }}
      >
        <AppPageTransition>
          <div className="items-center mx-auto ">
            <AppTrackingPlusHeader />
            <div className="container mx-auto my-5 ">
              <AppTrackingPlussTable
                loadingShowAlerts={loadingShowAlerts}
                items={trackingPlus}
                onShowAlerts={({ record }) => {
                  handleShowAlert(record.personId);
                }}
              />
            </div>
          </div>
        </AppPageTransition>
      </AppAuthorizationGuard>
    </div>
  );
};
