Feature: Administrator

A short summary of the feature

Background:
  Given I am using the admininistrator account
	Then My tokens are valid

Scenario: Database
  Then Gateway uses the database
    | Database | Collections  |
    | test_db  | Users,Events |

Scenario: Get Administrator Infomation
  #And Get my account information
  #  | Name  | Role          | Confirmed |
  #  | admin | Administrator | no        |
  #And I have some tasks
  #And I have some posts

@ignore
Scenario: Gateway settings
  Then Gateway has some settings
  When Gateway creates the setting
  Then Gateway has the setting
  When Gateway deletes the setting

@ignore
Scenario: Gateway cache
  Then Gateway has the cache value "key"
  And Gateway has the cache list "list_name"

@ignore
Scenario: Gateway message queue
  When Gateway publishes the message model
    | Queue | Message |
  And Gateway sends the mail to "user_email", subject "abcd"
    """
    this is the mail body
    """
  When Gateway publishes the message via MassTransit
  | Id | Content |

Scenario: Query events
  Then Gateway has some settings