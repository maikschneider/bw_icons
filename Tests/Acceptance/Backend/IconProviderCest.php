<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ExtensionConfiguration;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ModalDialog;
use Codeception\Attribute\Skip;

final class IconProviderCest
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

    public function canSeeNoProviderEnabledMessage(AcceptanceTester $I): void
    {
        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .callout-warning');
    }

    public function canSeeTypo3IconProvider(AcceptanceTester $I): void
    {
        $I->enableIconSets(['Typo3Icons']);

        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 30);
        $I->canSeeNumberOfElements(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', [760, 787]);
    }

    public function canSeeFontAwesome4Provider(AcceptanceTester $I): void
    {
        $I->enableIconSets(['font-awesome-4.7.0']);

        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 30);
        $I->canSeeNumberOfElements(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 583);
    }

    public function canSeeFontAwesome5Provider(AcceptanceTester $I): void
    {
        $I->enableIconSets(['font-awesome-5.15.4']);

        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 30);
        $I->canSeeNumberOfElements(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 1608);
    }

    #[Skip(reason: 'Font Awesome 6 css processing takes very long in CI, needs to be optimized before enabling test')]
    public function canSeeFontAwesome6Provider(AcceptanceTester $I): void
    {
        $I->enableIconSets(['font-awesome-6.7.2']);

        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 30);
        $I->canSeeNumberOfElements(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 2156);
    }

    public function canSeeProviderNavigation(AcceptanceTester $I): void
    {
        $I->enableIconSets(['Typo3Icons', 'font-awesome-5.15.4']);

        $I->openWizardModal();

        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard .nav-link', 30);
        $I->canSeeNumberOfElements(ModalDialog::$openedModalSelector . ' bw-icon-wizard .nav-link', 2);

        $I->click('//bw-icon-wizard//a[contains(@class, "nav-item") and contains(@class, "nav-link") and contains(text(), "Font Awesome 5")]');
        $I->wait(1);
        $I->canSeeNumberOfElements(ModalDialog::$openedModalSelector . ' bw-icon-wizard .icon-grid-item', 1608);
    }
}
