<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ExtensionConfiguration;

final class LanguageSynchronizationCest
{
    public function _before(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $configuration->write('pages', 2);
        $I->enableIconSets(['Typo3Icons']);
        $I->loginAsAdmin();
    }

    public function _after(AcceptanceTester $I): void
    {
        $I->enableIconSets(['']);
    }

    public function canSeeLanguageSynchronizationTogglesReadOnly(AcceptanceTester $I): void
    {
        $l10nSelector = 'input[name="data[pages][2][l10n_state][tx_bwicons_icon]"]';

        // Set an icon on the translated page
        $I->updateInDatabase(
            'pages',
            ['tx_bwicons_icon' => 'EXT:core/Resources/Public/Icons/T3Icons/svgs/actions/actions-brand-apple.svg'],
            ['uid' => 2]
        );

        $I->amOnPage('/typo3/record/edit?edit[pages][2]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);

        // l10n_state radio buttons exist
        $I->seeElement($l10nSelector);

        // Select "parent" — field becomes read-only
        $I->click($l10nSelector . '[value="parent"]');
        $I->wait(1);
        $I->seeElement('bw-icon-element .btn.btn-default[disabled]');
        $I->canSeeElementInDOM('bw-icon-element button.close.hidden');

        // Switch to "custom" — field becomes editable again
        $I->click($l10nSelector . '[value="custom"]');
        $I->wait(1);
        $I->dontSeeElement('bw-icon-element .btn.btn-default[disabled]');
        $I->canSeeElementInDOM('bw-icon-element button.close:not(.hidden)');
    }
}
