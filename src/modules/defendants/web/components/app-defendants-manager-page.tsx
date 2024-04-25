import { useEffect } from "react";
import AppConfig from "../../../../settings.json";

import { AppDefendantsHeader } from "./app-defendants-header";
import * as Icon from "react-feather";
import { useToggle } from "react-use";
import { AppDefendantsTable } from "./tables/app-defendants-table";
import { AppNewDefendantModal } from "./modals/app-new-defendant-modal";
import { useGetDefendants } from "../hooks/use-get-defendants";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppLoading } from "../../../../presentation/Components/AppLoading";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import { AppButton } from "../../../../presentation/Components/AppButton";
import { AppTooltip } from "../../../../presentation/Components/AppTooltip";
export const AppDefendantsManagerPage = () => {
  const { defendants, getDefendants } = useGetDefendants();
  const [toggleReload, setToggleReload] = useToggle(false);
  const [visibleNewDefendantModal, setVisibleNewDefendantModal] =
    useToggle(false);
  useEffect(() => {
    getDefendants({ completeName: "" });
  }, [toggleReload]);
  return (
    <AppAuthorizationGuard
      roles={
        AppConfig["userManagement.managerPage.authorization"] as UserRole[]
      }
      redirect={{ to: "/" }}
    >
      {!defendants && <AppLoading />}
      <AppNewDefendantModal
        isVisible={visibleNewDefendantModal}
        onClose={() => setVisibleNewDefendantModal(false)}
        onReload={() => {
          setToggleReload(!toggleReload);
        }}
      />
      <AppPageTransition>
        <div className="items-center mx-auto mb-5">
          <AppDefendantsHeader />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center">
          <div className="group relative inline-block text-center">
            <AppButton
              colorScheme="warn"
              onClick={() => setVisibleNewDefendantModal(true)}
            >
              <Icon.PlusCircle />
            </AppButton>
            <AppTooltip>New Defendant</AppTooltip>
          </div>
        </div>
        <div className="container mx-auto mt-5">
          <AppDefendantsTable onEdit={() => {}} items={defendants} />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
