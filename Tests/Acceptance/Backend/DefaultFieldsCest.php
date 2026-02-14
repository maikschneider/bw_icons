<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;

final class DefaultFieldsCest
{
    public function _before(AcceptanceTester $I): void
    {
        $I->loginAsAdmin();
    }

    public function canSeeDefaultFieldInPageProperties(AcceptanceTester $I): void
    {
        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
    }
}
