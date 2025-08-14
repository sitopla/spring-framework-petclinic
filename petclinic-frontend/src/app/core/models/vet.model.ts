import { Specialty } from './specialty.model';

export interface Vet {
  id: number;
  firstName: string;
  lastName: string;
  specialties: Specialty[];
}