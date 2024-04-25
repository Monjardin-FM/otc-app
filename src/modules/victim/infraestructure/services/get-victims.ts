import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { Victim } from "../../domain/entities/victim";
import { VictimRepository } from "../../domain/repositories/victim-repository";

export const getVictimsService: VictimRepository["getVictim"] = async (
  params
) => {
  const response = await api().get("Victim", {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
    json: {
      completeName: params.completeName,
    },
  });
  const { body } = await verifyResponse({ response });
  const data = body.data as any[];

  const victims = data.map<Victim>((victim) => ({
    idDefendant: victim.idDefendant,
    idPerson: victim.idPerson,
    idOfficer: victim.idOfficer,
    name: victim.name,
    lastName: victim.lasatName,
    idCounty: victim.idCounty,
    eMail: victim.eMail,
    birthDate: victim.birthDate,
    idGender: victim.idGender,
    idPersonType: victim.idPersonType,
    idStatus: victim.idStatus,
    createdAt: victim.created_at,
    idRole: victim.idRole,
    deviceId: victim.deviceId,
    idDeviceType: victim.idDeviceType,
    role: victim.role,
  }));
  return victims;
};
