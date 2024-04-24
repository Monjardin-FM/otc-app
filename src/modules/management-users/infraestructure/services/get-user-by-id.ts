import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { UserManageRepository } from "../../domain/repositories/user-manage-repository";

export const getUserByIdService: UserManageRepository["getUserById"] = async (
  params
) => {
  const response = await api().get(`User/id/${params.idUser}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    searchParams: {
      completeName: params.completeName,
    },
  });
  const { body } = await verifyResponse({ response });
  const data = body.data as any;

  const users = {
    idDefendant: data.idDefendant,
    idPerson: data.idPerson,
    idOfficer: data.idOfficer,
    name: data.name,
    lastName: data.lastName,
    idCounty: data.idCounty,
    eMail: data.eMail,
    birthDate: data.birthDate,
    idGender: data.idGender,
    idPersonType: data.idPersonType,
    idStatus: data.idStatus,
    createdAt: data.created_at,
    idRole: data.idRole,
    role: data.role,
  };
  return users;
};
