import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { UserManageRepository } from "../../domain/repositories/user-manage-repository";

export const updateUserService: UserManageRepository["updateUser"] = async (
  params
) => {
  const response = await api().put("User", {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
    json: { params },
  });
  await verifyResponse({ response });
};
