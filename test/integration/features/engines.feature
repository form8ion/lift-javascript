Feature: Engines

  Scenario: Engines defined for node
    Given a definition exists for engines.node
    And an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then the script is added for ensuring the node engines requirement is met
    And ls-engines is added as a dependency
    And the engines badge is added to the consumer group
