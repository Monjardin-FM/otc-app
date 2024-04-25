import { useEffect, useState } from "react";
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
import { Tooltip } from "@nextui-org/react";
export const AppDefendantsManagerPage = () => {
  const {
    defendants,
    getDefendants,
    loading: loadingDefendants,
  } = useGetDefendants();
  const [toggleReload, setToggleReload] = useToggle(false);
  const [visibleNewDefendantModal, setVisibleNewDefendantModal] =
    useToggle(false);
  const [search, setSearch] = useState<string>("");
  const onClick = (search: string) => {
    getDefendants({ completeName: search });
  };
  useEffect(() => {
    if (search.length > 1 || search.length === 0) {
      const timeDelay = setTimeout(() => {
        onClick(search);
      }, 500);
      return () => clearTimeout(timeDelay);
    }
  }, [search, toggleReload]);
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
          <AppDefendantsHeader
            onClick={onClick}
            loadingDefendants={loadingDefendants}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center">
          <Tooltip content={"New Defendant"} color="primary">
            <AppButton
              colorScheme="warn"
              onClick={() => setVisibleNewDefendantModal(true)}
            >
              <Icon.PlusCircle />
            </AppButton>
          </Tooltip>
        </div>
        <div className="container mx-auto mt-5">
          <AppDefendantsTable onEdit={() => {}} items={defendants} />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
