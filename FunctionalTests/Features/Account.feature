Feature: Account

A short summary of the feature

Background:
  Given Gateway is running
  And gateway is health


Scenario: Get user token
  Given I am the tester chen
  When Get my access tokens
  Then My tokens are valid

Scenario: Get user infomation
  Given I am the tester chen
  Then My tokens are valid
  And Get my account information
    | Name      | Role          | Profile | Confirmed |
    | tsinglung | Administrator | yes     | yes       |
  And Get my account profile
    | Surname | GivenName | Company | CompanyType | Title | Contact | Supplier | City | Address | Post | Phone | Fax |
  

Scenario: Check my email tokens

    Given I am the tester chen
    Then I have the email verify token from mailbox (mock up)
    Then I have the password reset token from mailbox (mock up)