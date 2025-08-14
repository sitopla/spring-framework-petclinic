import { PetType } from './pet-type.model';
import { Visit } from './visit.model';

export interface Pet {
  id?: number;
  name: string;
  birthDate: string;
  type: PetType;
  ownerId?: number;
  visits?: Visit[];
}