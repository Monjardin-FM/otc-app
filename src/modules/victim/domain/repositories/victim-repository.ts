import { Victim } from "../entities/victim";
import { VicimById } from "../entities/victim-by-id";

export type VictimRepository = {
  getVictimByEmail(params: {}): Promise<Victim>;
  getVictimDefendant(params: {
    completeName: string;
    idDefendant: number;
  }): Promise<Victim[]>;
  getVictimById(params: {
    completeName: string;
    idPerson: number;
  }): Promise<VicimById>;
  createVictim(params: {
    completeName: string;
    name: string;
    lastName: string;
    idDefendant: number;
    eMail: string;
    caseNumber: string;
    birthDate: string;
    idGender: number;
    idStatus: number;
    password: string;
  }): Promise<{
    data: number;
    statusCode: number;
    isSuccess: boolean;
    error?: {
      code?: string;
      message?: string;
      errors?: {};
    };
  }>;
  updateVictim(params: {
    idPerson: number;
    completeName: string;
    name: string;
    lastName: string;
    idDefendant: number;
    caseNumber: string;
    birthDate: string;
    idGender: number;
    idStatus: number;
    password: string;
  }): Promise<{
    statusCode: number;
    isSuccess: boolean;
    error?: {
      code?: string;
      message?: string;
      errors?: {};
    };
  }>;
  deleteVictim(parms: { idPerson: number }): Promise<Boolean>;
};
