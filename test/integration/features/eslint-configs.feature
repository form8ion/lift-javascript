Feature: ESLint Configs

  Scenario: No existing config, but no updates
    Given no existing eslint config file is present
    When the scaffolder results are processed
    Then no eslint config file exists

  Scenario: No existing config, but updates provided
    Given no existing eslint config file is present
    And the results include eslint configs
    When the scaffolder results are processed
    Then no eslint config file exists

  Scenario: existing yaml config without updates
    Given an existing eslint config file is present
    When the scaffolder results are processed
    Then no updates are applied to the existing yaml config file

  Scenario: existing yaml config with updates
    Given an existing eslint config file is present
    And the results include eslint configs
    When the scaffolder results are processed
    Then the yaml eslint config file is updated with the provided simple configs
