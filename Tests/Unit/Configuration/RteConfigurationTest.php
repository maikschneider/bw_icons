<?php

namespace Blueways\BwIconsTest\Unit\Configuration;

use Symfony\Component\Yaml\Yaml;
use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

class RteConfigurationTest extends UnitTestCase
{
    /**
     * Consumers like EXT:visual_editor read every importModules entry as array
     * with module and exports, the documented form
     */
    public function testImportModulesAreDeclaredWithTheirExports(): void
    {
        $configuration = Yaml::parseFile(__DIR__ . '/../../../Configuration/RTE/IconPicker.yaml');
        $importModules = $configuration['editor']['config']['importModules'] ?? [];

        self::assertNotEmpty($importModules);
        foreach ($importModules as $importModule) {
            self::assertIsArray($importModule);
            self::assertSame('@blueways/bw-icons/IconPicker.js', $importModule['module'] ?? null);
            self::assertSame(['default'], $importModule['exports'] ?? null);
        }
    }
}
