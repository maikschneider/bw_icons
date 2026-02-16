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
        $I->loginAsAdmin();
    }

    public function _after(AcceptanceTester $I): void
    {
        $I->enableIconSets(['']);
    }

    public function canSeeCustomMarkupInWizard(AcceptanceTester $I): void
    {
        $I->enableIconSets(['font-awesome-4.7.0-custom-markup']);

        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 30);
        $I->seeElement(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item span.custom-icon-wrapper');
        $I->dontSeeElement(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item i');
    }

    public function canSeeDefaultMarkupWithoutCustomSetting(AcceptanceTester $I): void
    {
        $I->enableIconSets(['font-awesome-4.7.0']);

        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 30);
        $I->seeElement(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item i');
        $I->dontSeeElement(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item span.custom-icon-wrapper');
    }

    public function canSeeCustomMarkupInFormElementAfterSelection(AcceptanceTester $I): void
    {
        $I->enableIconSets(['font-awesome-4.7.0-custom-markup']);

        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->click('bw-icon-element .btn.btn-default');
        $I->wait(1);

        $I->switchToIFrame();
        $I->waitForElement('.modal.show');
        $I->waitForElementVisible('.modal.show bw-icon-wizard .icon-grid-item', 30);

        $I->click('.modal.show bw-icon-wizard .icon-grid-item:first-child');
        $I->wait(1);
        $I->click('.modal.show .btn-primary');
        $I->wait(1);

        $I->switchToContentFrame();
        $I->seeElement('bw-icon-element span.custom-icon-wrapper');
    }
}
