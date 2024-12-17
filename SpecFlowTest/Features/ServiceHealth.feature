Feature: ServiceHealth

A short summary of the feature

Scenario: Open Browser
	Given I want to open browser msedge
	Given Wait 3 seconds
	Given I close the browser

Scenario: Get database
	Given Create user service client
	Then Get database and collections

Scenario: Create user admin
	Given Create user service client
	#And User admin should be not existing
	#When Create user admin
	#When Verify user with token 38CB63A14D92CEB02B66D9857EF3703F
	Then User admin should be confirmed

Scenario: User admin has logs
	Given Create user service client
	Then User admin has some logs