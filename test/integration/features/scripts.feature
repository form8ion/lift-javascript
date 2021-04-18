Feature: Scripts

  Scenario: No Additional Scripts from Results
    Given no additional scripts are included in the results
    And "npm" is the package manager
    And husky is not installed
    When the scaffolder results are processed
    Then the existing scripts still exist
    And no extra scripts were added

  Scenario: Additional Scripts Are Present in Results
    Given additional scripts are included in the results
    And "npm" is the package manager
    And husky is not installed
    When the scaffolder results are processed
    Then the existing scripts still exist
    And the additional scripts exist

  Scenario: Duplicate Scripts Are Present in Results
    Given additional scripts that duplicate existing scripts are included in the results
    And "npm" is the package manager
    And husky is not installed
    When the scaffolder results are processed
    Then the additional scripts exist
