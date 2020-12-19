Feature: Package Properties

  Scenario: Tags results when no existing keywords
    Given there are no existing keywords
    And tags are provided in the results
    And husky is not installed
    When the scaffolder results are processed
    Then keywords from the results exist

  Scenario: Tags results when some keywords exist
    Given there are existing keywords
    And tags are provided in the results
    And husky is not installed
    When the scaffolder results are processed
    Then the existing keywords still exist
    And keywords from the results exist
