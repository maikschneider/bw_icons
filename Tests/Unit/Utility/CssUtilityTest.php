<?php

namespace Blueways\BwIconsTest\Unit\Utility;

use Blueways\BwIcons\Utility\CssUtility;
use ReflectionMethod;
use TYPO3\CMS\Core\Attribute\AsAllowedCallable;
use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

class CssUtilityTest extends UnitTestCase
{
    public function testIncludeStyleSheetsIsAllowedAsTypoScriptCallable(): void
    {
        $method = new ReflectionMethod(CssUtility::class, 'includeStyleSheets');

        self::assertCount(1, $method->getAttributes(AsAllowedCallable::class));
    }
}
