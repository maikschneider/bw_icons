<?php

namespace Blueways\BwIconsTest\Unit\Provider;

use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

class CssIconProviderTest extends UnitTestCase
{
    public function testCleanFilePath(): void
    {
        self::assertEquals(
            'no-changes',
            CssIconProvider::cleanFilePath('no-changes')
        );

        self::assertEquals(
            'https://url.de/fonts/name.ttf',
            CssIconProvider::cleanFilePath('https://url.de/fonts/name.ttf?v=1224323')
        );

        self::assertEquals(
            'https://url.de/fonts/name.ttf',
            CssIconProvider::cleanFilePath('https://url.de/fonts/name.ttf#fontawesmome')
        );
    }
}
