import { DefendantById } from "../entities/defendant-by-id";
import { Defendant } from "../entities/defendant";
import { DefendantDevice } from "../entities/defendant-device";
import { Address } from "../entities/address";
import { SpecificAlarmParams } from "../entities/alarm-defendant-params";
import {
  AlarmDefendant,
  AlarmDefendantById,
} from "../entities/alarm-defendant";
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
  notes: string;
};
export type DefendantRepository = {
  getDefendant(params: { completeName: string }): Promise<Defendant[]>;
  getDefendantById(params: {
    // completeName: string;
    idPerson: number;
  }): Promise<DefendantById>;
  createDefendant(params: createDefendantParams): Promise<{
    statusCode: number;
    isSuccess: boolean;
    data: number;
    error: {
      code: string;
      message: string;
      errors: {};
    };
  }>;
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
    notes: string;
  }): Promise<{
    statusCode: number;
    isSuccess: boolean;
    error?: {
      code?: string;
      message?: string;
      errors?: {};
    };
  }>;
  deleteDefendant(parms: { idPerson: number }): Promise<Boolean>;
  getDeviceDefendant(params: {
    idDefendant: number;
  }): Promise<DefendantDevice[]>;
  assignDeviceDefendant(params: {
    idPerson: number;
    idDevice: number;
    idDeviceType: number;
  }): Promise<void>;
  deleteDeviceDefendant(params: { idDevice: number }): Promise<Boolean>;
  assignAddress(params: {
    idPerson: number;
    idAddressType: number;
    idCity: number;
    zipCode: string;
    streetAvenue: string;
    idStatus: number;
  }): Promise<void>;
  getAddressPerson(params: { idPerson: number }): Promise<Address[]>;
  getAddressById(params: { idAddress: number }): Promise<Address>;
  editAddressPerson(params: {
    idAddress: number;
    idAddressType: number;
    idCity: number;
    zipCode: string;
    streetAvenue: string;
    idStatus: number;
  }): Promise<void>;
  deleteAddressPerson(params: { idAddress: number }): Promise<Boolean>;
  assignAlarmDefendant(params: SpecificAlarmParams): Promise<void>;
  getSpecificAlarmDefendant: (params: {
    idPerson: number;
  }) => Promise<AlarmDefendant[]>;
  getSpecificAlarmById: (params: {
    idPersonSpecificAlarm: number;
  }) => Promise<AlarmDefendantById>;
  deleteSpecificAlarmDefendant: (params: {
    idAlarmDefendant: number;
  }) => Promise<Boolean>;
};
