Feature: Gateway

A short summary of the feature

Scenario: Connect to RPC service
	Then gRPC service is healthy
	And gRPC service returns simple user response

@ignore
Scenario: Create admin user
  Given I am the tester admin
  Then Check my account registered
    | Existing |
    | true     |

@ignore
Scenario: Create user with invalid email
  Given I am the tester invalid-user
  Then Check my account registered
    | Existing |
    | false    |
  Then Creating my account fails with exception
    | Name         |
    | invalid_user |
