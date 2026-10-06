import { uniqueName } from '../utils/testData';

// Every factory the tests create starts with this, so it is easy to find and safe to delete
export const FACTORY_NAME_PREFIX = 'Automation_Test_Factory_';

export interface FactoryDetails {
  name: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
}

// A new factory with a unique name. Same address as the customer test, which is known to work.
export function newFactoryDetails(): FactoryDetails {
  return {
    name: uniqueName(FACTORY_NAME_PREFIX),
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    street: 'Street1',
    zipCode: '560037',
  };
}