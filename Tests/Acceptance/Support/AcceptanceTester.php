<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Support;

use Blueways\BwIconsTest\Acceptance\Support\_generated\AcceptanceTesterActions;
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
        $I->click('#t3-login-submit-section > button');
        $I->waitForElement('.scaffold-header', 10);
    }

    public function openModule(string $moduleIdentifier): void
    {
        $I = $this;
        $I->click('//a[@data-modulemenu-identifier="' . $moduleIdentifier . '"]');
        $I->wait(1);
        $I->switchToContentFrame();
    }
}
