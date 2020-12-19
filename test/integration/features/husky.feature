Feature: Husky

  Scenario: Husky v5 installed, v4 config
    Given husky v5 is installed
    And husky config is in v4 format
    When the scaffolder results are processed
    Then the next-steps include a warning about the husky config

  Scenario: Husky v5 installed, v5 config
    Given husky v5 is installed
    And husky config is in v5 format
    When the scaffolder results are processed
    Then the next-steps do not include a warning about the husky config

  Scenario: Husky v4 installed, v4 config
    Given husky v4 is installed
    And husky config is in v4 format
    When the scaffolder results are processed
    Then the next-steps do not include a warning about the husky config
