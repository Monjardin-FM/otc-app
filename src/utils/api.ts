import ky from "ky";
import { createMockApi } from "./mock-api";
export const api = () => {
  const API_PATH = import.meta.env.VITE_REACT_APP_API_URL;
  const useMockApi = import.meta.env.VITE_REACT_APP_USE_MOCK_API !== "false";

  if (useMockApi) {
    return createMockApi();
  }

  if (!API_PATH) throw new Error("API credentials could not be found");
  return ky.create({
    prefixUrl: API_PATH,
    hooks: {
      afterResponse: [
        (_request, _options, response) => {
          if (response.status === 401) {
            localStorage.clear();
            window.location.reload();
          }
          return response;
        },
      ],
    },
  });
};
