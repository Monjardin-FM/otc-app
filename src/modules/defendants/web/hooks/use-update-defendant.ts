import { useAsyncFn } from "react-use";
import { DefendantRepository } from "../../domain/repositories/defendant-repository";
import { updateDefendantService } from "../../infraestructure/services/update-defendant";

export const useUpdateDefendant = () => {
  const [{ error, loading }, updateDefendant] = useAsyncFn<
    DefendantRepository["updateDefendant"]
  >(updateDefendantService, [updateDefendantService]);
  return {
    updateDefendant,
    error,
    loading,
  };
};
