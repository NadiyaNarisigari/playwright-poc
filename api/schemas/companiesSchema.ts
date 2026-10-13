import type { JSONSchemaType } from 'ajv';

// One company in the list
export interface Company {
  folderId: number;
  companyType: string;
  companyName: string;
  companyId: number;
}

// Response of GET /access-management/v1/companies
export interface CompaniesResponse {
  response: {
    companies: Company[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
}

// Required fields and their types. Values are not checked here, only the structure.
export const companiesResponseSchema: JSONSchemaType<CompaniesResponse> = {
  type: 'object',
  required: ['response'],
  properties: {
    response: {
      type: 'object',
      required: ['companies', 'totalItems', 'totalPages', 'currentPage'],
      properties: {
        companies: {
          type: 'array',
          items: {
            type: 'object',
            required: ['folderId', 'companyType', 'companyName', 'companyId'],
            properties: {
              folderId: { type: 'integer' },
              companyType: { type: 'string' },
              companyName: { type: 'string', minLength: 1 },
              companyId: { type: 'integer' },
            },
          },
        },
        totalItems: { type: 'integer', minimum: 0 },
        totalPages: { type: 'integer', minimum: 0 },
        currentPage: { type: 'integer', minimum: 0 },
      },
    },
  },
};