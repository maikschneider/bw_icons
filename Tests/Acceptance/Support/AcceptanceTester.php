<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Support;

use Blueways\BwIconsTest\Acceptance\Support\_generated\AcceptanceTesterActions;
use Blueways\BwIconsTest\Acceptance\Support\Helper\ModalDialog;
use Codeception\Actor;
use TYPO3\TestingFramework\Core\Acceptance\Step\FrameSteps;

/**
 * Inherited Methods
 * @method void wantTo($text)
 * @method void wantToTest($text)
 * @method void execute($callable)
 * @method void expectTo($prediction)
 * @method void expect($prediction)
 * @method void amGoingTo($argumentation)
 * @method void am($role)
 * @method void lookForwardTo($achieveValue)
 * @method void comment($description)
 * @method void pause($vars = [])
 * @SuppressWarnings(PHPMD)
 */
class AcceptanceTester extends Actor
{
    use AcceptanceTesterActions;

    use FrameSteps;

    /**
     * Define custom actions here
     */
    public function loginAsAdmin(): void
    {
        $I = $this;
        $I->amOnPage('/typo3');
        $I->waitForElement('#t3-username', 10);
        $I->fillField('#t3-username', 'admin');
        $I->fillField('#t3-password', 'Passw0rd!');
        $I->wait(1);
        $I->click('#t3-login-submit-section > button');
        $I->waitForElement('.scaffold-header', 10);
    }

    public function enableIconSets(array $iconSets): void
    {
        $I = $this;
        $pageTsInclude = array_map(static function (string $iconSet) {
            if ($iconSet === '') {
                return '';
            }
            if ($iconSet === 'Typo3Icons') {
                return '@import "EXT:bw_icons/Configuration/TSconfig/Page/Typo3Icons.tsconfig"';
            }
            return '@import "EXT:bw_icons/Tests/Fixtures/' . $iconSet . '/page.tsconfig"';
        }, $iconSets);
        $pageTsIncludeString = implode("\n", $pageTsInclude);
        $I->updateInDatabase(
            'pages',
            ['TSconfig' => $pageTsIncludeString],
            ['uid' => 1]
        );
        $I->runShellCommand('typo3 cache:flush');
    }

    public function openWizardModal(string $table = 'pages'): void
    {
        $I = $this;
        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->click('bw-icon-element .btn.btn-default');
        $I->switchToMainFrame();
        $I->waitForElementVisible(ModalDialog::$openedModalSelector . ' bw-icon-wizard', 10);
    }

    public function openModule(string $moduleIdentifier): void
    {
        $I = $this;
        $I->click('//a[@data-modulemenu-identifier="' . $moduleIdentifier . '"]');
        $I->wait(1);
        $I->switchToContentFrame();
    }
}
