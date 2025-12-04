Feature: Sample

A short summary of the feature
- authors
- bookmarks
- files
- posts
- queues
- weather forecasts

Scenario: Sample service status
	Then Sample has some authors
	Then Sample has some bookmarks
	Then Sample has some files
	Then Sample has some posts
	#Then Sample has the author
	#Then Sample has the bookmark
	#When Sample deletes the author
	#When Sample adds the bookmark
	#When Sample deletes the bookmark

Scenario: Get bookmarks

	Then Sample has some bookmarks

Scenario: Create author

	When Sample adds the author
	| Name | Title | Address | Region |
	| test | test  | test    | test   |

Scenario: Get weather forecast

	Then Sample gets weather forecast	