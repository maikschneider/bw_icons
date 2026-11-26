<?php

namespace Blueways\BwIconsTest\Unit\Provider;

use Blueways\BwIcons\Domain\Model\Dto\WizardFolder;
use Blueways\BwIcons\Domain\Model\Dto\WizardIcon;
use Blueways\BwIcons\Provider\CssIconProvider;
use Blueways\BwIcons\Utility\SvgReaderUtility;
use Blueways\BwIcons\Utility\TtfReaderUtility;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use TYPO3\CMS\Core\Core\ApplicationContext;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\TestingFramework\Core\Unit\UnitTestCase;

class CssIconProviderTest extends UnitTestCase
{
    protected bool $backupEnvironment = true;

    private string $fixturePath;

    protected function setUp(): void
    {
        parent::setUp();

        $projectPath = dirname(__DIR__, 3);
        $this->fixturePath = $projectPath . '/Tests/Fixtures';
        $varPath = $projectPath . '/var/tests/css-icon-provider-' . bin2hex(random_bytes(4));
        $publicPath = $varPath . '/public';
        mkdir($publicPath, 0775, true);

        Environment::initialize(
            new ApplicationContext('Testing'),
            true,
            true,
            $projectPath,
            $publicPath,
            $varPath,
            $projectPath . '/config',
            $projectPath . '/vendor/bin/phpunit',
            'UNIX'
        );
        $GLOBALS['TYPO3_CONF_VARS']['SYS']['folderCreateMask'] = '2775';
        $GLOBALS['TYPO3_CONF_VARS']['SYS']['fileCreateMask'] = '0664';

        $this->testFilesToDelete[] = $varPath;
    }

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

    /**
     * Pins the icon classes generated for the Font Awesome fixtures, so changes
     * to the selector and prefix detection cannot silently change them. The
     * hash is md5(implode("\n", $iconClasses)) of each icon folder.
     *
     * @return array<string, array{string, array<string, array{int, string, string, string}>}>
     */
    public static function fontAwesomeFixturesDataProvider(): array
    {
        return [
            'Font Awesome 4.7.0' => [
                'font-awesome-4.7.0/css/font-awesome.css',
                [
                    'FontAwesome' => [583, 'fa fa-glass', 'fa fa-meetup', '43b718b2be6b4036a25f49bc7b3dc61e'],
                ],
            ],
            'Font Awesome 5.15.4' => [
                'font-awesome-5.15.4/css/all.css',
                [
                    'Font Awesome 5 Brands' => [456, 'fab fa-500px', 'fab fa-zhihu', '6164cc112c8ca17cdd4105f96217a7fe'],
                    'Font Awesome 5 Free 400' => [151, 'fa fa-address-book', 'fa fa-window-restore', '7a8b805bf147338a0e9ed9f04e59fcb4'],
                    'Font Awesome 5 Free 900' => [1001, 'fa fa-ad', 'fa fa-yin-yang', 'dec24c781c490734e728a04415ee2d8a'],
                ],
            ],
            'Font Awesome 6.7.2' => [
                'font-awesome-6.7.2/css/all.css',
                [
                    'Font Awesome 6 Brands' => [543, 'fab fa-0', 'fab fa-steam-symbol', '79d6a6c5222ee8b42cff03d36d66f198'],
                    'Font Awesome 6 Free 400' => [211, 'fas fa-0', 'fas fa-font-awesome', '9329a7ef0fb57ab1dd5e0fa6dfb998b4'],
                    'Font Awesome 6 Free 900' => [1402, 'fas fa-0', 'fas fa-web-awesome', 'd136345ffb7373dc06920e0b9f0f43f0'],
                ],
            ],
        ];
    }

    /**
     * @param array<string, array{int, string, string, string}> $expectedFolders
     */
    #[Test]
    #[DataProvider('fontAwesomeFixturesDataProvider')]
    public function fontAwesomeIconClassesStayTheSame(string $cssFile, array $expectedFolders): void
    {
        $iconClasses = $this->getIconClassesByFolder($this->createProvider($cssFile));

        self::assertSame(array_keys($expectedFolders), array_keys($iconClasses));
        foreach ($expectedFolders as $title => [$count, $first, $last, $hash]) {
            self::assertCount($count, $iconClasses[$title], $title);
            self::assertSame($first, $iconClasses[$title][0], $title);
            self::assertSame($last, $iconClasses[$title][$count - 1], $title);
            self::assertSame($hash, md5(implode("\n", $iconClasses[$title])), $title);
        }
    }

    /**
     * An @font-face without font-weight used to crash with a TypeError
     * (see #88). The prefix class sets "font-weight: normal", which must still
     * match the font-face, otherwise the prefix is lost and its font-family
     * rule is missing in the generated stylesheet.
     */
    #[Test]
    public function fontFaceWithoutFontWeightIsParsed(): void
    {
        $provider = $this->createProvider('font-face-without-weight/style.css');

        self::assertSame(
            ['noweight' => ['nw nw-home', 'nw nw-star']],
            $this->getIconClassesByFolder($provider)
        );
        self::assertStringContainsString(
            '.nw{font-family:"noweight";font-weight:normal;}',
            (string)file_get_contents($provider->getCssTempFilePath())
        );
    }

    /**
     * Icomoon applies the font with "[class^="icon-"], [class*=" icon-"]".
     * That attribute selector must not end up as prefix in the icon classes,
     * but its font-family block is needed in the generated stylesheet (#136).
     */
    #[Test]
    public function icomoonAttributeSelectorIsNoIconClassPrefix(): void
    {
        $provider = $this->createProvider('icomoon/style.css');

        self::assertSame(
            ['icomoon' => ['icon-home', 'icon-star']],
            $this->getIconClassesByFolder($provider)
        );
        $css = (string)file_get_contents($provider->getCssTempFilePath());
        self::assertStringContainsString('[class^="icon-"],[class*=" icon-"]{font-family:"icomoon" !important;', $css);
        self::assertStringContainsString(".icon-home:before{content:\"\u{e900}\";}", $css);
        self::assertSame(1, substr_count($css, '[class^="icon-"]'));
    }

    /**
     * Glyph rules that set the font-family themselves are no prefix candidates
     */
    #[Test]
    public function glyphRulesWithFontFamilyAreNoIconClassPrefix(): void
    {
        self::assertSame(
            ['glyphfont' => ['icon-home', 'icon-star']],
            $this->getIconClassesByFolder($this->createProvider('font-family-in-glyph-rules/style.css'))
        );
    }

    /**
     * Bootstrap Icons 1.11 only ships woff2 and woff. WOFF (1.0) is read with
     * php-font-lib, woff2 is skipped (#45).
     */
    #[Test]
    public function woffOnlyFontIsParsed(): void
    {
        $provider = $this->createProvider('bootstrap-icons-1.11.3/font/bootstrap-icons.css');

        $iconClasses = $this->getIconClassesByFolder($provider);

        self::assertSame(['bootstrap-icons'], array_keys($iconClasses));
        self::assertCount(2050, $iconClasses['bootstrap-icons']);
        self::assertSame('bi bi-123', $iconClasses['bootstrap-icons'][0]);
        self::assertSame('bi bi-vignette', $iconClasses['bootstrap-icons'][2049]);
        self::assertFileExists($provider->getTempPath() . '/bootstrap-icons.woff');
        self::assertStringContainsString(
            '.bi::before,[class^="bi-"]::before,[class*=" bi-"]::before{display:inline-block;font-family:bootstrap-icons !important;',
            (string)file_get_contents($provider->getCssTempFilePath())
        );
    }

    /**
     * @return array<string, list<string>>
     */
    private function getIconClassesByFolder(CssIconProvider $provider): array
    {
        $iconClasses = [];
        foreach ($provider->getIcons() as $folder) {
            self::assertInstanceOf(WizardFolder::class, $folder);
            $iconClasses[$folder->title] = array_values(array_map(
                fn (WizardIcon $icon) => $icon->value,
                $folder->icons
            ));
        }

        return $iconClasses;
    }

    private function createProvider(string $cssFile): CssIconProvider
    {
        $provider = new CssIconProvider(
            ['file' => $this->fixturePath . '/' . $cssFile],
            new SvgReaderUtility(),
            new TtfReaderUtility()
        );
        $provider->setCacheIdentifier('unit');
        $provider->setId(md5($cssFile));

        return $provider;
    }
}
