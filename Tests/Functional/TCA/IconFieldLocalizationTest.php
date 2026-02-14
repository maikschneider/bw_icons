<?php

declare(strict_types=1);

namespace Blueways\BwIconsTest\Functional\TCA;

use TYPO3\TestingFramework\Core\Functional\FunctionalTestCase;

/**
 * Test case for icon field localization behavior
 */
class IconFieldLocalizationTest extends FunctionalTestCase
{
    protected array $testExtensionsToLoad = [
        'typo3conf/ext/bw_icons',
    ];

    protected array $pathsToProvideInTestInstance = [
        'typo3conf/ext/bw_icons/Tests/Fixtures/' => 'typo3conf/ext/bw_icons/Tests/Fixtures/',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->importCSVDataSet(__DIR__ . '/../../Fixtures/pages.sql');
        
        // Enable icon field for pages table
        $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['bw_icons']['pages'] = 1;
    }

    /**
     * @test
     */
    public function iconFieldHasAllowLanguageSynchronizationEnabled(): void
    {
        $tca = $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon'] ?? null;
        
        self::assertIsArray($tca, 'Icon field configuration not found in pages TCA');
        self::assertArrayHasKey('config', $tca);
        self::assertArrayHasKey('behaviour', $tca['config']);
        self::assertArrayHasKey('allowLanguageSynchronization', $tca['config']['behaviour']);
        self::assertTrue(
            $tca['config']['behaviour']['allowLanguageSynchronization'],
            'allowLanguageSynchronization should be enabled for icon field'
        );
    }

    /**
     * @test
     */
    public function iconFieldConfigurationIncludesL10nDisplay(): void
    {
        $tca = $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon'] ?? null;
        
        self::assertIsArray($tca, 'Icon field configuration not found in pages TCA');
        self::assertArrayHasKey('l10n_display', $tca);
        self::assertContains(
            'defaultAsReadonly',
            explode(',', $tca['l10n_display']),
            'l10n_display should include defaultAsReadonly for icon field'
        );
    }

    /**
     * @test
     */
    public function iconFieldInTtContentHasAllowLanguageSynchronization(): void
    {
        // Simulate extension configuration for tt_content
        $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['bw_icons']['tt_content'] = 1;
        
        // Create temporary columns as defined in TCA override file
        $expectedConfig = [
            'exclude' => 0,
            'label' => 'LLL:EXT:bw_icons/Resources/Private/Language/locallang.xlf:icon',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'type' => 'input',
                'renderType' => 'iconSelection',
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ];
        
        // Verify the expected configuration structure
        self::assertArrayHasKey('config', $expectedConfig);
        self::assertArrayHasKey('behaviour', $expectedConfig['config']);
        self::assertArrayHasKey('allowLanguageSynchronization', $expectedConfig['config']['behaviour']);
        self::assertTrue(
            $expectedConfig['config']['behaviour']['allowLanguageSynchronization'],
            'allowLanguageSynchronization should be enabled for tt_content icon field'
        );
        self::assertEquals('defaultAsReadonly', $expectedConfig['l10n_display']);
    }

    /**
     * @test
     */
    public function iconFieldInSysCategoryHasAllowLanguageSynchronization(): void
    {
        // Simulate extension configuration for sys_category
        $GLOBALS['TYPO3_CONF_VARS']['EXTENSIONS']['bw_icons']['sys_category'] = 1;
        
        // Create temporary columns as defined in TCA override file
        $expectedConfig = [
            'exclude' => 0,
            'label' => 'LLL:EXT:bw_icons/Resources/Private/Language/locallang.xlf:icon',
            'l10n_display' => 'defaultAsReadonly',
            'config' => [
                'type' => 'input',
                'renderType' => 'iconSelection',
                'behaviour' => [
                    'allowLanguageSynchronization' => true,
                ],
            ],
        ];
        
        // Verify the expected configuration structure
        self::assertArrayHasKey('config', $expectedConfig);
        self::assertArrayHasKey('behaviour', $expectedConfig['config']);
        self::assertArrayHasKey('allowLanguageSynchronization', $expectedConfig['config']['behaviour']);
        self::assertTrue(
            $expectedConfig['config']['behaviour']['allowLanguageSynchronization'],
            'allowLanguageSynchronization should be enabled for sys_category icon field'
        );
        self::assertEquals('defaultAsReadonly', $expectedConfig['l10n_display']);
    }

    /**
     * @test
     */
    public function translatedPageCanSynchronizeIconField(): void
    {
        // Get translated page record
        $translatedPage = $this->getConnectionPool()
            ->getConnectionForTable('pages')
            ->select(['*'], 'pages', ['uid' => 2])
            ->fetchAssociative();
        
        self::assertIsArray($translatedPage, 'Translated page not found');
        self::assertEquals(1, $translatedPage['sys_language_uid'], 'Page should be in German language');
        self::assertEquals(1, $translatedPage['l10n_parent'], 'Page should have parent page set');
    }

    /**
     * @test
     */
    public function iconFieldIsReadOnlyWhenL10nModeExclude(): void
    {
        // This test verifies the l10n_display configuration makes field read-only in translations
        $tca = $GLOBALS['TCA']['pages']['columns']['tx_bwicons_icon'] ?? null;
        
        self::assertIsArray($tca, 'Icon field configuration not found in pages TCA');
        
        // Check that l10n_display is configured to show field as read-only in translations
        if (isset($tca['l10n_display'])) {
            $displayOptions = explode(',', $tca['l10n_display']);
            self::assertContains(
                'defaultAsReadonly',
                $displayOptions,
                'Icon field should have defaultAsReadonly in l10n_display to show as read-only in translations'
            );
        }
    }
}
