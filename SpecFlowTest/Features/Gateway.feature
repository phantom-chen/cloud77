Feature: Gateway

A short summary of the feature

Scenario: Gateway is running
	Given Wait 1 seconds
	Then gRPC service is healthy
	And gRPC service returns simple user response