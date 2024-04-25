import { useAsyncFn } from 'react-use';
import { CatalogRepository } from '../domain/repositories/catalog-repository';
import { getSpecificAlarmService } from '../infraestructure/services/get-specific-alarm';

export const useGetSpecificAlarm = () => {
  const [{ value: SpecificAlarm, loading, error }, getSpecificAlarm] =
    useAsyncFn<CatalogRepository['getSpecificAlarm']>(getSpecificAlarmService, [
      getSpecificAlarmService,
    ]);
  return {
    SpecificAlarm,
    loading,
    error,
    getSpecificAlarm,
  };
};
