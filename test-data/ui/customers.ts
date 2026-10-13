import { requiredEnv } from '../../utils/env';
import { shortUniqueName } from '../../utils/testData';

export interface CustomerDetails {
  name: string;
  csmEmail: string;
  country: string;
  state: string;
  city: string;
  street: string;
  zipCode: string;
}

// Every customer the tests create starts with this, so it is easy to find and safe to delete
export const TEST_CUSTOMER_PREFIX = 'AutoTest-Customer-';

// Prefix + random part, 30 characters in total, so names stay unique across parallel workers
const CUSTOMER_NAME_MAX_LENGTH = 30;

// A new customer with a unique name.
// Names may only use letters, digits, '_' and '-'. The CSM email is real, so it comes from .env.
export function newTestCustomer(): CustomerDetails {
  return {
    name: shortUniqueName(TEST_CUSTOMER_PREFIX, CUSTOMER_NAME_MAX_LENGTH),
    csmEmail: requiredEnv('QA_CSM_EMAIL'),
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    street: 'Street1',
    zipCode: '560037',
  };
}