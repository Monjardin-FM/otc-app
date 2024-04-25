import { useAsyncFn } from "react-use";
import { VictimRepository } from "../../domain/repositories/victim-repository";
import { updateVictimService } from "../../infraestructure/services/update-victim";

export const useUpdateVictim = () => {
  const [{ error, loading }, updateVictim] = useAsyncFn<
    VictimRepository["updateVictim"]
  >(updateVictimService, [updateVictimService]);
  return {
    updateVictim,
    error,
    loading,
  };
};
