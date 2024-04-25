import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { DefendantRepository } from "../../domain/repositories/defendant-repository";

export const getDefendantByIdService: DefendantRepository["getDefendantById"] =
  async (params) => {
    const response = await api().get(`Defendant/Id/${params.idPerson}`, {
      headers: {
        Authorization: `Bearer ${token()}`,
        // 'Content-Type': 'application/json',
      },
      // body: JSON.stringify({ completeName: params.completeName }),
    });
    const { body } = await verifyResponse({ response });
    const data = body.data as any;

    const defendantByID = {
      idDefendant: data.idDefendant,
      idPerson: data.idPerson,
      idOfficer: data.idOfficer,
      name: data.name,
      lastName: data.lastName,
      idCounty: data.idCounty,
      eMail: data.eMail,
      caseNumber: data.caseNumber,
      birthDate: data.birthDate,
      idGender: data.idGender,
      sid: data.sid,
      offense: data.offense,
      idPersonType: data.idPersonType,
      idStatus: data.idStatus,
      createdAt: data.created_at,
      idRole: data.idRole,
    };
    return defendantByID;
  };
