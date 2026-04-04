<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ExtensionConfiguration;

final class LanguageExcludeModeCest
{
    public function _before(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $configuration->write('pages', 1);
        $I->enableIconSets(['Typo3Icons']);
        $I->loginAsAdmin();
    }

    public function _after(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $I->enableIconSets(['']);
        $configuration->write('pages', 0);
    }

    public function canSeeNoElementInExcludeMode(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $configuration->write('pages', 3);
        $I->amOnPage('/typo3/record/edit?edit[pages][2]=edit');

        $I->switchToContentFrame();
        $I->waitForElementVisible('form[name="editform"]', 10);
        $I->dontSeeElement('bw-icon-element');
    }

    public function canSeeDisabledElementInExcludeModeWithReadOnly(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $configuration->write('pages', 4);
        $I->amOnPage('/typo3/record/edit?edit[pages][2]=edit');

        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->seeElement('bw-icon-element .btn.btn-default[disabled]');
    }
}
