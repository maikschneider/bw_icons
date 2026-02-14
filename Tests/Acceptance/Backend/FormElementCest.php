<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Acceptance\Backend;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;

final class FormElementCest
{
    public function _before(AcceptanceTester $I): void
    {
        $I->loginAsAdmin();
    }

    public function canSeeSearchButtonOfElement(AcceptanceTester $I): void
    {
        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->seeElement('bw-icon-element .btn.btn-default');
    }

    public function canSeeEmptyStateOfElement(AcceptanceTester $I): void
    {
        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->dontSeeElement('bw-icon-element img');
        $I->dontSeeElement('bw-icon-element .fontIcon');
        $I->dontSeeElement('bw-icon-element button.close:not(.hidden)');
    }

    public function canSeeFilledStateWithSvgOfElement(AcceptanceTester $I): void
    {
        $I->updateInDatabase(
            'pages',
            ['tx_bwicons_icon' => 'EXT:core/Resources/Public/Icons/T3Icons/svgs/actions/actions-brand-apple.svg'],
            ['uid' => 1]
        );

        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->seeElement('bw-icon-element img.img-thumbnail[alt="actions-brand-apple"][src$="actions/actions-brand-apple.svg"]');
        $I->dontSeeElement('bw-icon-element .close.hidden');
    }

    public function canSeeFilledStateWithFontIconOfElement(AcceptanceTester $I): void
    {
        $I->updateInDatabase(
            'pages',
            ['tx_bwicons_icon' => 'fa-solid fa-apple-whole'],
            ['uid' => 1]
        );

        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->seeElement('bw-icon-element .fontIcon.fa-solid.fa-apple-whole');
        $I->dontSeeElement('bw-icon-element img');
        $I->dontSeeElement('bw-icon-element .close.hidden');
    }

    public function canSeeRemoveButtonDeletesIcon(AcceptanceTester $I): void
    {
        $I->updateInDatabase(
            'pages',
            ['tx_bwicons_icon' => 'EXT:core/Resources/Public/Icons/T3Icons/svgs/actions/actions-brand-apple.svg'],
            ['uid' => 1]
        );

        $I->amOnPage('/typo3/record/edit?edit[pages][1]=edit');
        $I->switchToContentFrame();
        $I->waitForElementVisible('bw-icon-element', 10);
        $I->seeElement('bw-icon-element img');

        // click remove button
        $I->click('bw-icon-element button.close');
        $I->dontSeeElement('bw-icon-element img');

        // trigger save to persist changes
        $I->click('button[name="_savedok"]');
        $I->wait(1);
        $I->waitForElement('bw-icon-element', 10);

        // verify in database
        $I->canSeeInDatabase(
            'pages',
            ['uid' => 1, 'tx_bwicons_icon' => '']
        );

        // verify in UI
        $I->dontSeeElement('bw-icon-element img');
        $I->dontSeeElement('bw-icon-element .fontIcon');
    }
}
