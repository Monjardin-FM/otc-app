import { useState } from "react";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import AppConfig from "../../../../settings.json";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppTrackingInactiveDefendantsHeader } from "./app-tracking-inactive-defendants-header";
import { AppTrackingHistoricInactiveDefendants } from "./app-tracking-historic-inactive-defendants";

export const AppTrackingInactiveDefendantsManagerPage = () => {
  const [idDefendant, setIdDefendant] = useState<number>();
  return (
    <AppAuthorizationGuard
      roles={
        AppConfig[
          "tracking.inactive.defendants.managerPage.authorization"
        ] as UserRole[]
      }
      redirect={{ to: "/" }}
    >
      <AppPageTransition>
        <div className="items-center mx-auto ">
          <AppTrackingInactiveDefendantsHeader
            onSearch={(id: number | undefined) => {
              setIdDefendant(id);
            }}
          />
        </div>
        <AppTrackingHistoricInactiveDefendants idDefendant={idDefendant} />
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
