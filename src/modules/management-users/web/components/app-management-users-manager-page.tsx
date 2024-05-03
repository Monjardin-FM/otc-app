import { useEffect, useState } from "react";
import AppConfig from "../../../../settings.json";
import { AppManagemenetUsersHeader } from "./app-management-users-header";
import { AppManagementUsersTable } from "./tables/app-management-users-table";
import { useToggle } from "react-use";
import { AppNewUserModal } from "./modals/app-new-user-modal";
import { useGetUsers } from "../hooks/use-get-users";
import { AppEditUserModal } from "./modals/app-edit-user-modal";
import { useDeleteUser } from "../hooks/use-delete-user";
import { AppToast } from "../../../../presentation/Components/AppToast";
import { AppAuthorizationGuard } from "../../../../presentation/Components/AppAuthorizationGuard";
import { UserRole } from "../../../user/domain/entities/user-role";
import { AppLoading } from "../../../../presentation/Components/AppLoading";
import { AppPageTransition } from "../../../../presentation/Components/AppPageTransition";
import * as Icon from "react-feather";
import { Button, Tooltip } from "@nextui-org/react";
export const ManagementUsersManagerPage = () => {
  const [visibleNewUserModal, setVisibleNewUserModal] = useToggle(false);
  const [visibleEditUserModal, setVisibleEditUserModal] = useToggle(false);
  const { users, getUsers, error, loading: loadingUsers } = useGetUsers();
  const [toggleReload, setToggleReload] = useToggle(false);
  const [userId, setUserId] = useState<number | null>(1);
  const { deleteUser, error: errorDelete } = useDeleteUser();
  const [search, setSearch] = useState<string>("");
  const onClick = (search: string) => {
    getUsers({ completeName: search });
  };
  const onDelete = () => {
    AppToast().fire({
      title: "User deleted",
      icon: "success",
      text: "The user was deleted succesfully",
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
    if (error) {
      AppToast().fire({ title: "Error" });
    }
  }, [error]);
  useEffect(() => {
    getUsers({ completeName: "" });
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
      {!users && <AppLoading />}
      <AppNewUserModal
        isVisible={visibleNewUserModal}
        onClose={() => setVisibleNewUserModal(false)}
        onReload={() => setToggleReload(!toggleReload)}
      />
      <AppEditUserModal
        isVisible={visibleEditUserModal}
        onClose={() => setVisibleEditUserModal(false)}
        onReload={() => setToggleReload(!toggleReload)}
        idUser={userId}
      />
      <AppPageTransition>
        <div className="items-center mx-auto mb-5">
          <AppManagemenetUsersHeader
            onClick={onClick}
            loadingUsers={loadingUsers}
            search={search}
            setSearch={setSearch}
          />
        </div>
        <div className="container mx-auto flex flex-col items-end jusitfy-center">
          <Tooltip
            content={"New User"}
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
              onClick={() => setVisibleNewUserModal(true)}
              isIconOnly
              size="md"
            >
              <Icon.PlusCircle color="white" />
            </Button>
          </Tooltip>
        </div>
        <div className="container mx-auto mt-5 mb-16">
          <AppManagementUsersTable
            onDelete={async (record) => {
              await deleteUser({ idPerson: record.record.idPerson });
              if (!errorDelete) onDelete();
              setToggleReload(!toggleReload);
            }}
            onEdit={({ record }) => {
              setUserId(record.idPerson);
              setVisibleEditUserModal(true);
            }}
            items={users}
          />
        </div>
      </AppPageTransition>
    </AppAuthorizationGuard>
  );
};
