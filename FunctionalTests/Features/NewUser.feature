Feature: NewUser

A short summary of the feature

Scenario: Create new user

  Given I am the tester user
  Then Check my account registered
    | Existing |
    | false    |
  When Create my account
    | Name        |
    | simple_user |
  Then Check my account registered
    | Existing |
    | true     |
  And I have the email verify token from mailbox (mock up)

Scenario: User gets access token
  Given I am the tester user
  When Get my access tokens
  Then My tokens are valid

Scenario: User verifies email

  Given I am the tester user
  Then My tokens are valid
  And Get my account information
    | Name        | Role | Profile | Confirmed |
    | simple_user | User | no      | no        |
  And I have the email verify token from mailbox (mock up)
  When Verify my email with the token from email
  Then Get my account information
    | Name        | Role | Profile | Confirmed |
    | simple_user | User | no      | yes       |

Scenario: Get user information

  Given I am the tester user
  Then My tokens are valid
  And Get my account information
    | Name        | Role | Profile | Confirmed |
    | simple_user | User | no      | no        |

Scenario: Update user profile

  Given I am the tester user
  Then My tokens are valid
  And Get my account information
    | Name        | Role | Profile | Confirmed |
    | simple_user | User | no      | no        |
  When Update my account profile
    | Surname | GivenName | Company | CompanyType | Title | Contact | Supplier | City | Address | Post | Phone | Fax |
    | a       | a         | a       | a           | a     | a       | a        | a    | a       | a    | a     | a   |

Scenario: Delete user profile

  Given I am the tester user
  Then My tokens are valid
  And Get my account information
    | Name        | Role | Profile | Confirmed |
    | simple_user | User | no      | no        |
  When Update my account profile
    | Surname | GivenName | Company | CompanyType | Title | Contact | Supplier | City | Address | Post | Phone | Fax |
    |         |           |         |             |       |         |          |      |         |      |       |     |
  Then Get my account information
    | Name        | Role | Profile | Confirmed |
    | simple_user | User | no      | no        |

Scenario: Other resources

  Given I am the tester user
  Then My tokens are valid
  And I have zero tasks
  And I have zero posts

Scenario: Update task

Scenario: Update post