import { useAsyncFn } from "react-use";
import { DefendantRepository } from "../../domain/repositories/defendant-repository";
import { createDefendantService } from "../../infraestructure/services/create-defendant";

export const useCreateDefendant = () => {
  const [{ value, loading, error }, createDefendant] = useAsyncFn<
    DefendantRepository["createDefendant"]
  >(createDefendantService, [createDefendantService]);
  // console.log("Error hook", value && value[1]);
  // console.table(error);
  return {
    value,
    createDefendant,
    loading,
    error,
  };
};
