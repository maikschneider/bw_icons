<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ExtensionConfiguration;

final class WizardModalCest
{
    public function _before(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $configuration->write('pages', 1);
        $I->enableIconSets(['Typo3Icons']);
        $I->loginAsAdmin();
    }

    public function _after(AcceptanceTester $I): void
    {
        $I->enableIconSets(['']);
    }

    public function canSeeWizardModalOpensAndSelectionIsWorking(AcceptanceTester $I): void
    {
        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->click('bw-icon-element .btn.btn-default');
        $I->wait(1);

        $I->switchToIFrame();
        $I->waitForElement('.modal');
        $I->seeElement('.modal bw-icon-wizard');

        $I->seeNumberOfElements('.modal bw-icon-wizard .icon-grid-item', [50, 999]);

        $I->click('.modal bw-icon-wizard .icon-grid-item img[alt="actions-brand-apple"]');
        $I->wait(1);
        $I->seeNumberOfElements('.modal bw-icon-wizard .icon-grid-item.active', 1);
        $I->click('.modal .btn-primary');
        $I->wait(1);

        $I->switchToContentFrame();
        $I->seeElement('bw-icon-element img.img-thumbnail[alt="actions-brand-apple"][src$="actions/actions-brand-apple.svg"]');
        $I->seeInField(
            'input[name="data[pages][1][tx_bwicons_icon]"]',
            'EXT:core/Resources/Public/Icons/T3Icons/svgs/actions/actions-brand-apple.svg'
        );
    }

    public function canSeeWizardSearchFilterIsWorking(AcceptanceTester $I): void
    {
        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->click('bw-icon-element .btn.btn-default');
        $I->wait(1);

        $I->switchToIFrame();
        $I->waitForElement('.modal');
        $I->seeElement('.modal bw-icon-wizard');

        $I->fillField('.modal bw-icon-wizard input[type="search"]', 'apple');
        $I->wait(1);
        $I->seeNumberOfElements('.modal bw-icon-wizard .icon-grid-item', [1, 1]);
    }
}
