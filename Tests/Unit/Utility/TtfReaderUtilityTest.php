<?php

namespace Blueways\BwIconsTest\Unit\Utility;

use Blueways\BwIcons\Utility\TtfReaderUtility;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

class TtfReaderUtilityTest extends UnitTestCase
{
    private const FONT_PATH = __DIR__ . '/../../Fixtures/font-awesome-4.7.0/fonts/fontawesome-webfont';

    #[Test]
    public function readsTheSameGlyphsFromWoffAndTrueTypeFonts(): void
    {
        $subject = new TtfReaderUtility();

        $ttfGlyphs = $subject->getGlyphs(self::FONT_PATH . '.ttf');

        self::assertCount(704, $ttfGlyphs);
        self::assertSame($ttfGlyphs, $subject->getGlyphs(self::FONT_PATH . '.woff'));
    }

    #[Test]
    public function returnsNoGlyphsForUnsupportedWoff2Fonts(): void
    {
        self::assertSame([], (new TtfReaderUtility())->getGlyphs(self::FONT_PATH . '.woff2'));
    }
}
