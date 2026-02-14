<?php

namespace Blueways\BwIconsTest\Acceptance\Support\Extension;

use Codeception\Events;
use Codeception\Extension;

class EnvironmentExtension extends Extension
{
    /**
     * @var array<Events::*, string>
     */
    public static array $events = [
        Events::SUITE_BEFORE => 'beforeSuite',
    ];

    public function beforeSuite(): void
    {
        // Bootstrap TYPO3 environment
        require_once dirname(__DIR__, 4) . '/vendor/typo3/testing-framework/Resources/Core/Build/UnitTestsBootstrap.php';
    }
}
