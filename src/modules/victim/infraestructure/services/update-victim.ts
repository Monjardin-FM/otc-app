import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { VictimRepository } from "../../domain/repositories/victim-repository";

export const updateVictimService: VictimRepository["updateVictim"] = async (
  params
) => {
  const response = await api().put("Victim", {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
    json: { params },
  });
  await verifyResponse({ response });
};
