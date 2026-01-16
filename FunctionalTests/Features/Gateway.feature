Feature: Gateway

A short summary of the feature

Background:
	Given I am using the admininistrator account

Scenario: Gateway is running
	
	Given Gateway is running
	And gateway is health

@set-up
Scenario: Administrator get tokens
	Given I am using the admininistrator account
	When Get my access tokens
	Then My tokens are valid

Scenario: Services are health

	Given I am using the admininistrator account
	Then My tokens are valid
	Given sample is health
	And user is health
	And super is health
  # api/agent
	Then Gateway gets the service agent sample
	And Gateway gets the service agent user
	And Gateway gets the service agent super
	And Gateway gets the service agent canteen
  # api/values
	And Gateway gets values from service agent sample
	And Gateway gets values from service agent super
	And Gateway gets values from service agent canteen

	And Gateway gets system information