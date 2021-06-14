Feature: ESLint Configs

  Scenario: No existing config
    Given no existing eslint config file is present
    And an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then no eslint config file exists

  Scenario: existing yaml config
    Given an existing eslint config file is present
    And an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then the yaml eslint config file contains the expected config

  Scenario: existing yaml config and shareable configs to add
    Given an existing eslint config file is present
    And an "npm" lockfile exists
    And husky v5 is installed
    And additional shareable configs are provided
    When the scaffolder results are processed
    Then the yaml eslint config file contains the expected config
    And dependencies are defined for the additional configs

  Scenario: existing yaml config and complex shareable configs to add
    Given an existing eslint config file is present
    And an "npm" lockfile exists
    And husky v5 is installed
    And complex additional shareable configs are provided
    When the scaffolder results are processed
    Then the yaml eslint config file contains the expected config
    And dependencies are defined for the additional configs
