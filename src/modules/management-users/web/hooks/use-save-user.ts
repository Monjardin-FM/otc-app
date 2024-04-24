import { useAsyncFn } from "react-use";
import { UserManageRepository } from "../../domain/repositories/user-manage-repository";
import { saveUserService } from "../../infraestructure/services/save-user";

export const useSaveUser = () => {
  const [{ loading, error }, createUser] = useAsyncFn<
    UserManageRepository["saveUser"]
  >(saveUserService, [saveUserService]);
  return {
    createUser,
    loading,
    error,
  };
};
