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
import { Button, Tooltip } from "@nextui-org/react";
import { useDeleteDefendant } from "../hooks/use-delete-defendant";
import { AppToast } from "../../../../presentation/Components/AppToast";
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
  const { deleteDefendant, error: errorDelete } = useDeleteDefendant();
  const onClick = (search: string) => {
    getDefendants({ completeName: search });
  };
  const onDelete = () => {
    AppToast().fire({
      title: "Defendant deleted",
      icon: "success",
      text: "The defendant was deleted succesfully",
    });
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
  useEffect(() => {
    if (errorDelete) {
      AppToast().fire({
        title: "Error",
        icon: "error",
        text: "An error occurred while trying to delete the user",
      });
    }
  }, [errorDelete]);
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
        <div className="items-center mx-auto mb-10">
          <AppDefendantsHeader
            onClick={onClick}
            loadingDefendants={loadingDefendants}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center mt-5">
          <Tooltip
            content={"New Defendant"}
            color="primary"
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
              onClick={() => setVisibleNewDefendantModal(true)}
              isIconOnly
              size="md"
            >
              <Icon.PlusCircle color="white" />
            </Button>
          </Tooltip>
        </div>
        <div className="container mx-auto mt-5">
          <AppDefendantsTable
            onEdit={() => {}}
            items={defendants}
            onDelete={async (record) => {
              await deleteDefendant({ idPerson: record.record.idPerson });
              if (!errorDelete) onDelete();
              setToggleReload(!toggleReload);
            }}
          />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
