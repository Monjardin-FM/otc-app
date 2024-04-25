import { api } from "../../../../utils/api";
import { verifyResponse } from "../../../../utils/check-response";
import { token } from "../../../../utils/token";
import { DefendantRepository } from "../../domain/repositories/defendant-repository";

export const createDefendantService: DefendantRepository["createDefendant"] =
  async (params) => {
    const response = await api().post("Defendant", {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
      json: params,
    });

    const { body } = await verifyResponse({ response });
    const id: number = body.data || 0;
    return id;
  };
