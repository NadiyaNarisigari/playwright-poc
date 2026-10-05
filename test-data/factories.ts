export const FACTORY_NAME_PREFIX = 'Automation_Test_Factory_';

export interface FactoryDetails {
  name: string;
  country: string;
  state: string;
  city: string;
  street: string;
}

/** Builds factory details with a name that is unique on every call. */
export function newFactoryDetails(): FactoryDetails {
  return {
    name: `${FACTORY_NAME_PREFIX}${Date.now()}`,
    country: 'India',
    state: 'Andhra Pradesh',
    city: 'Adoni',
    street: '123 Automation Street',
  };
}