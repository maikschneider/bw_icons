<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ExtensionConfiguration;
use Codeception\Attribute\Examples;
use Codeception\Example;

final class DefaultFieldsCest
{
    public function _before(AcceptanceTester $I): void
    {
        $I->loginAsAdmin();
    }

    #[Examples(table: 'pages')]
    #[Examples(table: 'tt_content')]
    #[Examples(table: 'sys_category')]
    public function canNotSeeDefaultFields(AcceptanceTester $I, Example $example, ExtensionConfiguration $configuration): void
    {
        $table = $example['table'];
        $configuration->write($table, 0);
        $I->amOnPage('/typo3/record/edit?edit[' . $table . '][1]=edit');

        $I->switchToContentFrame();
        $I->waitForElementVisible('form[name="editform"]', 10);
        $I->dontSeeElement('bw-icon-element');
    }

    #[Examples(table: 'pages')]
    #[Examples(table: 'tt_content')]
    #[Examples(table: 'sys_category')]
    public function canSeeDefaultFieldInPageProperties(AcceptanceTester $I, Example $example, ExtensionConfiguration $configuration): void
    {
        $table = $example['table'];
        $configuration->write($table, 1);
        $I->amOnPage('/typo3/record/edit?edit[' . $table . '][1]=edit');

        $I->switchToContentFrame();
        $I->waitForElementVisible('form[name="editform"]', 10);
        $I->seeElement('bw-icon-element');
    }
}
