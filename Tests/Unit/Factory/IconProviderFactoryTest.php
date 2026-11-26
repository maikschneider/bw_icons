<?php

namespace Blueways\BwIconsTest\Unit\Factory;

use Blueways\BwIcons\Factory\IconProviderFactory;
use Blueways\BwIcons\Provider\CssIconProvider;
use Blueways\BwIcons\Provider\FileIconProvider;
use Blueways\BwIcons\Utility\SvgReaderUtility;
use Blueways\BwIcons\Utility\TtfReaderUtility;
use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

class IconProviderFactoryTest extends UnitTestCase
{
    public function testCreatesFileIconProvider(): void
    {
        $provider = $this->createFactory()->create(FileIconProvider::class, ['folder' => 'EXT:bw_icons/Resources/Public/Images/']);

        self::assertInstanceOf(FileIconProvider::class, $provider);
    }

    public function testCreatesSubclassesOfCssIconProviderWithFontReaders(): void
    {
        $provider = $this->createFactory()->create(CustomCssIconProvider::class, ['file' => 'EXT:bw_icons/Tests/Fixtures/icons.css']);

        self::assertInstanceOf(CustomCssIconProvider::class, $provider);
    }

    private function createFactory(): IconProviderFactory
    {
        return new IconProviderFactory(new SvgReaderUtility(), new TtfReaderUtility());
    }
}

class CustomCssIconProvider extends CssIconProvider
{
}
