import { DefendantById } from '../entities/defendant-by-id';
import { Defendant } from '../entities/defendant';
export type createDefendantParams = {
  completeName: string;
  name: string;
  lastName: string;
  idCounty: number;
  idOfficer: number;
  eMail: string;
  sid: string;
  offense: string;
  caseNumber: string;
  birthDate: string;
  idGender: number;
  idStatus: number;
  password: string;
};
export type DefendantRepository = {
  getDefendant(params: { completeName: string }): Promise<Defendant[]>;
  getDefendantById(params: {
    // completeName: string;
    idPerson: number;
  }): Promise<DefendantById>;
  createDefendant(params: createDefendantParams): Promise<number>;
  updateDefendant(params: {
    idPerson: number;
    completeName: string;
    name: string;
    lastName: string;
    idCounty: number;
    idOfficer: number;
    sid: string;
    offense: string;
    caseNumber: string;
    birthDate: string;
    idGender: number;
    idStatus: number;
    password: string;
  }): Promise<void>;
  deleteDefendant(parms: { idPerson: number }): Promise<Boolean>;
  assignDeviceDefendant(params: {
    idPerson: number;
    idDevice: number;
    idDeviceType: number;
  }): Promise<void>;
  assignAddress(params: {
    idAddressType: number;
    idCity: number;
    zipCode: string;
    streetAvenue: string;
    idStatus: number;
  }): Promise<void>;
};
