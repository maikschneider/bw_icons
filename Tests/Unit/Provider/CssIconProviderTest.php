<?php

namespace Blueways\BwIconsTest\Unit\Provider;

use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

class CssIconProviderTest extends UnitTestCase
{

    public function testCleanFilePath()
    {
        $provider = new CssIconProvider([]);

        $this->assertEquals(
            'no-changes',
            $provider::cleanFilePath('no-changes')
        );

        $this->assertEquals(
            'https://url.de/fonts/name.ttf',
            $provider::cleanFilePath('https://url.de/fonts/name.ttf?v=1224323')
        );

        $this->assertEquals(
            'https://url.de/fonts/name.ttf',
            $provider::cleanFilePath('https://url.de/fonts/name.ttf#fontawesmome')
        );
    }
}
