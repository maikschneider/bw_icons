<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ExtensionConfiguration;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ModalDialog;

final class CustomMarkupCest
{
    public function _before(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $configuration->write('pages', 1);
        $I->enableIconSets(['font-awesome-4.7.0-custom-markup']);
        $I->loginAsAdmin();
    }

    public function _after(AcceptanceTester $I, ExtensionConfiguration $configuration): void
    {
        $configuration->write('pages', 0);
        $I->enableIconSets(['']);
    }

    public function canSeeCustomMarkupInWizardAndSavedSelection(AcceptanceTester $I): void
    {
        $I->openWizardModal();

        // validate markup in wizard
        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item span.custom-icon-wrapper', 30);
        $I->dontSeeElement(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item i');

        // select first icon and save
        $I->click(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item span.custom-icon-wrapper.fa-glass');
        $I->wait(1);
        $I->click(ModalDialog::$openedModalSelector . ' .btn-primary');
        $I->wait(1);

        // validate markup in content frame after selection
        $I->switchToContentFrame();
        $I->seeElement('bw-icon-element span.custom-icon-wrapper.fa-glass');
        $I->dontSeeElement('bw-icon-element i');
    }

    public function canSeeCustomMarkupInLoadedSelection(AcceptanceTester $I): void
    {
        $I->updateInDatabase(
            'pages',
            ['tx_bwicons_icon' => 'fa fa-glass'],
            ['uid' => 1]
        );

        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('form[name="editform"]', 10);
        $I->seeElement('bw-icon-element span.custom-icon-wrapper.fa-glass');
        $I->dontSeeElement('bw-icon-element i');
    }
}
