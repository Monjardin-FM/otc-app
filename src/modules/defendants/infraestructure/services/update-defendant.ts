import { api } from "../../../../utils/api";
import { token } from "../../../../utils/token";
import { DefendantRepository } from "../../domain/repositories/defendant-repository";

export const updateDefendantService: DefendantRepository["updateDefendant"] =
  async (params) => {
    const response = await api().put("Defendant", {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
      json: params,
    });
    const { body } = await verifyResponse({ response });
    return body;
  };

const verifyResponse = async ({ response }: { response?: Response }) => {
  if (!response || !response.ok) {
    throw new Error("An error occurred during the call to the web service");
  }

  const body = await response.json();
  // const SUCCESS_CODE = 200;
  // const isSuccess = body.statusCode === SUCCESS_CODE && body.isSuccess;
  // console.log(`response service:  ${response}`);
  // console.log(`body service:  ${body}`);

  // if (!isSuccess) {
  //   // Regresa el error original en lugar de lanzar un nuevo error
  //   return { body };
  // }

  return { body };
};
