Feature: Gateway

A short summary of the feature

Background: 
	Given I am the tester admin

Scenario: Gateway is running
	
	Given Gateway is running
	Given gateway is health
	
Scenario: gateway key

	Given Gateway is running

Scenario: services are health

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