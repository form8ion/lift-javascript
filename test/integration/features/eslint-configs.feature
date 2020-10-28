Feature: ESLint Configs

  Scenario: No existing config
    Given no existing eslint config file is present
    When the scaffolder results are processed
    Then no eslint config file exists

  Scenario: existing yaml config
    Given an existing eslint config file is present
    And the results include eslint configs
    When the scaffolder results are processed
    Then the yaml eslint config file contains the expected config
