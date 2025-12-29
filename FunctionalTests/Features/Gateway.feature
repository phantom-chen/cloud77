Feature: Gateway

A short summary of the feature

Background:
	Given I am the tester admin

Scenario: Gateway is running
	
	Given Gateway is running
	And gateway is health

@ignore
Scenario: Administrator get tokens
	Given I am the tester admin
	When Get my access tokens
	Then My tokens are valid

Scenario: Services are health

	Given I am the tester admin
	Then My tokens are valid
	Given sample is health
	And user is health
	And super is health
  # api/agent
	Then Gateway gets the service agent sample
	And Gateway gets the service agent user
	And Gateway gets the service agent super
  # api/values
	And Gateway gets values from service agent sample
	And Gateway gets values from service agent super
	And Gateway gets values from service agent canteen

	And Gateway gets system information