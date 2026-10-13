import { shortUniqueName } from '../../utils/testData';

// Every factory the tests create starts with this, so it is easy to find and safe to delete
export const FACTORY_NAME_PREFIX = 'Automation_Test_Factory_';

// Factory names are kept to 30 characters, so the whole name can be matched in the factory list
const FACTORY_NAME_MAX_LENGTH = 30;

export interface FactoryDetails {
  name: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
}

// A new factory with a unique name, e.g. "Automation_Test_Factory_K7Q2ZD".
// Same address as the customer test, which is known to work.
export function newFactoryDetails(): FactoryDetails {
  return {
    name: shortUniqueName(FACTORY_NAME_PREFIX, FACTORY_NAME_MAX_LENGTH),
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    street: 'Street1',
    zipCode: '560037',
  };
}