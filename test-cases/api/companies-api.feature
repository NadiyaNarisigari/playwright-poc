Feature: Companies API - list companies
  As a QA engineer
  I want to verify GET /access-management/v1/companies on the API gateway
  So that company data is returned correctly and only to authorised callers

  # Token: a valid bearer token for the QA environment, taken from a logged-in session.
  # Never paste real tokens into this file, test reports or tickets.

  Background:
    Given the API gateway base URL for the QA environment

  # Automated in tests/API/companies.spec.ts
  Scenario: Get customer companies with a valid token
    Given I have a valid bearer token
    When I send GET /access-management/v1/companies with parameters:
      | includeFields | companyName |
      | companyType   | customer    |
      | pageNumber    | 0           |
      | search        |             |
    Then the response status is 200
    And the response content type is application/json
    And the response body is not empty

  # Manual - expected result to be confirmed with the Noedra team
  Scenario: Request without a token is rejected
    Given I have no bearer token
    When I send GET /access-management/v1/companies with companyType "customer"
    Then the response status is 401
    And no company data is returned

  # Manual - expected result to be confirmed with the Noedra team
  Scenario: Request with an invalid or expired token is rejected
    Given I have an invalid or expired bearer token
    When I send GET /access-management/v1/companies with companyType "customer"
    Then the response status is 401
    And no company data is returned

  # Manual - response structure to be confirmed with the Noedra team
  Scenario: Only the requested fields are returned
    Given I have a valid bearer token
    When I send GET /access-management/v1/companies with includeFields "companyName" and companyType "customer"
    Then each company in the response contains a companyName