<?php

namespace Blueways\BwIcons\Provider;

use Blueways\BwIcons\Domain\Model\Dto\WizardFolder;
use Blueways\BwIcons\Domain\Model\Dto\WizardIcon;
use Blueways\BwIcons\Utility\SvgReaderUtility;
use Blueways\BwIcons\Utility\TtfReaderUtility;
use Sabberworm\CSS\CSSList\Document;
use Sabberworm\CSS\OutputFormat;
use Sabberworm\CSS\Parser;
use Sabberworm\CSS\RuleSet\AtRuleSet;
use Sabberworm\CSS\RuleSet\DeclarationBlock;
use Sabberworm\CSS\RuleSet\RuleSet;
use Sabberworm\CSS\Value\CSSFunction;
use Sabberworm\CSS\Value\CSSString;
use Sabberworm\CSS\Value\RuleValueList;
use Sabberworm\CSS\Value\Size;
use Sabberworm\CSS\Value\URL;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;

class CssIconProvider extends AbstractIconProvider
{
    /**
     * @var SvgReaderUtility
     */
    protected SvgReaderUtility $svgReaderUtility;

    /**
     * @var TtfReaderUtility
     */
    protected TtfReaderUtility $ttfReaderUtility;

    public function __construct($options)
    {
        parent::__construct($options);
        $this->loadDependencies();
        $this->svgReaderUtility = GeneralUtility::makeInstance(SvgReaderUtility::class);
        $this->ttfReaderUtility = GeneralUtility::makeInstance(TtfReaderUtility::class);
    }

    /**
     * Load CSS parser library if not available
     */
    protected function loadDependencies(): void
    {
        if (!class_exists('\Sabberworm\CSS\CSSList\Document')) {
            @include 'phar://' . ExtensionManagementUtility::extPath('bw_icons') . 'Libraries/sabberworm-php-css-parser.phar/vendor/autoload.php';
        }
    }

    /**
     * Get the stylesheet URL for frontend usage
     */
    public function getStyleSheet(): string
    {
        if (!$this->tempFileExist()) {
            $this->getIcons();
        }
        $tempFile = $this->getCssTempFilePath();
        return '/' . substr(PathUtility::getRelativePath(Environment::getPublicPath(), $tempFile), 0, -1);
    }

    /**
     * Check if the temporary CSS file exists
     */
    public function tempFileExist(): bool
    {
        return file_exists($this->getCssTempFilePath());
    }

    /**
     * Get the path to the temporary CSS file
     */
    public function getCssTempFilePath(): string
    {
        return $this->getTempPath() . '/font.css';
    }

    /**
     * Get the temporary directory path
     */
    public function getTempPath(): string
    {
        return Environment::getPublicPath() . '/typo3temp/assets/tx_bwicons/' . $this->getCacheIdentifier() . '/' . $this->getId();
    }

    /**
     * Get the current directory path of the CSS file
     */
    public function getCurrentPath(): string
    {
        $path = $this->options['file'];
        if (!GeneralUtility::isValidUrl($path) || strpos($path, 'EXT:') === 0) {
            $path = GeneralUtility::getFileAbsFileName($path);
        }
        return pathinfo($path, PATHINFO_DIRNAME);
    }

    /**
     * Process the CSS file and extract icon information
     */
    public function getIcons(): array
    {
        $styleSheetContent = $this->getStyleSheetContent();
        $parser = new Parser($styleSheetContent);
        $cssDocument = $parser->parse();
        $allRules = $cssDocument->getAllRuleSets();

        $tempFile = new Document();
        $cssData = $this->extractCssData($allRules, $tempFile);

        $wizardFolders = $this->processIconFonts(
            $cssData['fontFaces'],
            $cssData['cssGlyphs'],
            $cssData['rulesUsingFontFamily'],
            $allRules,
            $tempFile
        );

        $this->writeTempCss($tempFile);

        return $wizardFolders;
    }

    /**
     * Extract and categorize CSS rules
     */
    protected function extractCssData(array $allRules, Document $tempFile): array
    {
        $fontFaces = [];
        $cssGlyphs = [];
        $rulesUsingFontFamily = [];

        foreach ($allRules as $rule) {
            if ($this->isFontFaceRule($rule)) {
                $fontFaces[] = $rule;
                $this->downloadFontFilesOfFontFaceRules($rule);
                $tempFile->append($rule);
            }

            if ($this->isGlyphRule($rule) && !$this->glyphExistsInSet($rule, $cssGlyphs)) {
                $cssGlyphs[] = $rule;
                $tempFile->append($rule);
            }

            if ($this->getFontFamilyNameOfRuleSet($rule)) {
                $rulesUsingFontFamily[] = $rule;
            }
        }

        // Filter for font-faces that are actually used
        $fontFaces = $this->filterUsedFontFaces($fontFaces, $rulesUsingFontFamily);

        return [
            'fontFaces' => $fontFaces,
            'cssGlyphs' => $cssGlyphs,
            'rulesUsingFontFamily' => $rulesUsingFontFamily,
        ];
    }

    /**
     * Process icon fonts and create wizard folders
     */
    protected function processIconFonts(
        array $fontFaces,
        array $cssGlyphs,
        array $rulesUsingFontFamily,
        array $allRules,
        Document $tempFile
    ): array {
        $wizardFolders = [];

        // Extract font files from font-faces
        $svgFonts = $this->extractFontFilesFromFontFaces('svg', $fontFaces);
        $ttfFonts = $this->extractFontFilesFromFontFaces('ttf', $fontFaces);

        // Get different font-families
        $fontFamilies = $this->extractFontFamilies($fontFaces);

        foreach ($fontFamilies as $key => $font) {
            // Skip if no svg or ttf font found
            if (!empty($svgFonts[$key])) {
                $fontGlyphs = $this->svgReaderUtility->getGlyphs($svgFonts[$key]);
            } elseif (!empty($ttfFonts[$key])) {
                $fontGlyphs = $this->ttfReaderUtility->getGlyphs($ttfFonts[$key]);
            } else {
                continue;
            }

            // Filter glyphs for the ones in font file
            $availableGlyphs = $this->filterAvailableGlyphs($cssGlyphs, $fontGlyphs);

            // Get font name (with weight if needed for uniqueness)
            $fontName = $this->getFontDisplayName($font, $fontFamilies);

            // Extract font prefix (e.g., "fa " for Font Awesome)
            $fontFamilyPrefix = $this->extractFontPrefix(
                $font,
                $rulesUsingFontFamily,
                $allRules,
                $tempFile
            );

            // Map icons to class names
            $icons = $this->createIconsFromGlyphs($availableGlyphs, $fontFamilyPrefix);

            $wizardFolder = new WizardFolder();
            $wizardFolder->title = $fontName;
            $wizardFolder->icons = $icons;

            $wizardFolders[] = $wizardFolder;
        }

        return $wizardFolders;
    }

    /**
     * Check if rule is a font-face rule
     */
    protected function isFontFaceRule(RuleSet $rule): bool
    {
        return is_a($rule, AtRuleSet::class) && $rule->atRuleName() === 'font-face';
    }

    /**
     * Check if rule defines a glyph
     */
    protected function isGlyphRule($rule): bool
    {
        // Validate that declaration has content property and exactly one selector
        if (!is_a($rule, DeclarationBlock::class)
            || count($rule->getSelectors()) !== 1
            || count($rule->getRules('content')) !== 1
        ) {
            return false;
        }

        // Validate content-property (exists and is not "")
        $contentRule = $rule->getRules('content')[0];
        if (!$contentRule || !$contentRule->getValue() || !is_a(
            $contentRule->getValue(),
            CSSString::class
        ) || !$contentRule->getValue()->getString() || $contentRule->getValue()->getString() === '') {
            return false;
        }

        // Validate selector (is class and has :before or :after)
        $selector = $rule->getSelectors()[0]->getSelector();
        if (strlen($selector) < 7 || strpos($selector, '.') !== 0) {
            return false;
        }

        return strpos($selector, ':before', -7) || strpos($selector, ':after', -6);
    }

    /**
     * Check if a glyph already exists in a set
     */
    protected function glyphExistsInSet(DeclarationBlock $cssGlyph, array $cssGlyphs): bool
    {
        $contentRules = $cssGlyph->getRules('content');
        $glyphString = $contentRules[0]->getValue()->getString();

        foreach ($cssGlyphs as $setRule) {
            $contentRules = $setRule->getRules('content');
            $glyphStringInSet = $contentRules[0]->getValue()->getString();
            if ($glyphString === $glyphStringInSet) {
                return true;
            }
        }

        return false;
    }

    /**
     * Filter font-faces to only those that are actually used
     */
    protected function filterUsedFontFaces(array $fontFaces, array $rulesUsingFontFamily): array
    {
        return array_filter($fontFaces, function ($fontFace) use ($rulesUsingFontFamily) {
            $fontFamilyName = $fontFace->getRules('font-family')[0]->getValue()->getString();
            foreach ($rulesUsingFontFamily as $ruleUsingFontFamily) {
                if ($this->getFontFamilyNameOfRuleSet($ruleUsingFontFamily) === $fontFamilyName) {
                    return true;
                }
            }
            return false;
        });
    }

    /**
     * Extract font family information from font-face rules
     */
    protected function extractFontFamilies(array $fontFaces): array
    {
        return array_map(function ($ruleSet) {
            $familyRules = $ruleSet->getRules('font-family');
            $familyRuleName = $familyRules[0]->getValue()->getString();

            $weightRules = $ruleSet->getRules('font-weight');
            $weight = count($weightRules) ? $weightRules[0]->getValue() : '';
            $weight = is_a($weight, Size::class) ? $weight->getSize() : $weight;

            $styleRules = $ruleSet->getRules('font-style');

            return [
                'font-family' => $familyRuleName,
                'weight' => $weight,
                'style' => count($styleRules) ? $styleRules[0]->getValue() : '',
            ];
        }, $fontFaces);
    }

    /**
     * Filter glyphs to only those available in the font
     */
    protected function filterAvailableGlyphs(array $cssGlyphs, array $fontGlyphs): array
    {
        return array_filter($cssGlyphs, function ($cssGlyph) use ($fontGlyphs) {
            $rules = $cssGlyph->getRules('content');
            $glyphString = $rules[0]->getValue()->getString();
            return in_array($glyphString, $fontGlyphs, true);
        });
    }

    /**
     * Get display name for font (with weight if needed for uniqueness)
     */
    protected function getFontDisplayName(array $font, array $fontFamilies): string
    {
        $fontName = $font['font-family'];
        $duplicateExists = count(array_filter($fontFamilies, function ($fontFamily) use ($font) {
            return $fontFamily['font-family'] === $font['font-family'];
        })) > 1;

        if ($duplicateExists) {
            $fontName = $font['font-family'] . ' ' . $font['weight'];
        }

        return $fontName;
    }

    /**
     * Extract font prefix class (e.g. ".fab" for Font Awesome Brands)
     */
    protected function extractFontPrefix(
        array $font,
        array $rulesUsingFontFamily,
        array $allRules,
        Document $tempFile
    ): string {
        $fontFamilyPrefix = '';

        foreach ($rulesUsingFontFamily as $block) {
            if ($this->getFontFamilyNameOfRuleSet($block) !== $font['font-family']) {
                continue;
            }

            // Skip if checking all glyphs
            if (count($block->getSelectors()) === count($this->countGlyphsInFont($font))) {
                continue;
            }

            // Extract prefix class (e.g. ".fab .fa-brand")
            $validSelectors = $this->getValidSelectors($block);

            // Collect all styles of valid selectors
            $selectorBlockToCheck = $this->collectSelectorBlocks($validSelectors, $allRules);

            // Check each selector for matching font family and weight
            foreach ($selectorBlockToCheck as $selectorName => $blocks) {
                if ($this->selectorMatchesFontFamily($blocks, $font)) {
                    $fontFamilyPrefix = substr($selectorName, 1) . ' ';

                    // Add all matching blocks to the temp file
                    foreach ($blocks as $blockRule) {
                        $tempFile->append($blockRule);
                    }

                    // Once found, we can break the loop
                    break;
                }
            }
        }

        return $fontFamilyPrefix;
    }

    /**
     * Get valid selectors from a block
     */
    protected function getValidSelectors(DeclarationBlock $block): array
    {
        $validSelectors = [];

        foreach ($block->getSelectors() as $selector) {
            $selectorString = $selector->getSelector();

            // Check that selector matches requirements
            $selectorContainsClassAttr = str_contains($selectorString, '[class');
            $isClassSelector = str_starts_with($selectorString, '.');
            $selectorContainsSpace = str_contains($selectorString, ' ');

            if (!($selectorContainsClassAttr || $isClassSelector) || $selectorContainsSpace) {
                continue;
            }

            $validSelectors[] = $selector;
        }

        return $validSelectors;
    }

    /**
     * Collect all blocks related to a set of selectors
     */
    protected function collectSelectorBlocks(array $validSelectors, array $allRules): array
    {
        $selectorBlockToCheck = [];

        foreach ($allRules as $block) {
            if (!is_a($block, DeclarationBlock::class)) {
                continue;
            }

            $selectors = (array)$block->getSelectors();

            foreach ($selectors as $selector) {
                $atomicSelectors = $this->splitCssSelector($selector->getSelector());

                if (!count(array_intersect($validSelectors, $atomicSelectors))) {
                    continue;
                }

                $selectorBlockToCheck[$selector->getSelector()] ??= [];
                $selectorBlockToCheck[$selector->getSelector()][] = $block;
            }
        }

        return $selectorBlockToCheck;
    }

    /**
     * Check if a selector's blocks match a specific font family and weight
     */
    protected function selectorMatchesFontFamily(array $blocks, array $font): bool
    {
        $fontFamilyMatches = $fontWeightMatches = false;

        foreach ($blocks as $blockRule) {
            if ($this->getFontFamilyNameOfRuleSet($blockRule) === $font['font-family']) {
                $fontFamilyMatches = true;
            }

            if ($this->getFontWeightOfRuleSet($blockRule) === $font['weight']) {
                $fontWeightMatches = true;
            }
        }

        return $fontFamilyMatches && $fontWeightMatches;
    }

    /**
     * Count glyphs in a font (placeholder implementation)
     */
    protected function countGlyphsInFont(array $font): array
    {
        // This is a placeholder method since the original code doesn't fully define this functionality
        // In a real implementation, this would count actual glyphs in the font
        return [];
    }

    /**
     * Create WizardIcon objects from glyph declarations
     */
    protected function createIconsFromGlyphs(array $availableGlyphs, string $fontFamilyPrefix): array
    {
        return array_map(function ($declarationBlock) use ($fontFamilyPrefix) {
            $atomicSelectors = [$fontFamilyPrefix, ...$this->splitCssSelector($declarationBlock->getSelectors()[0]->getSelector())];

            $atomicSelectors = array_map(function ($selector) {
                return str_replace(['.'], [''], $selector);
            }, $atomicSelectors);

            $atomicSelectors = array_unique($atomicSelectors);
            $value = implode(' ', $atomicSelectors);

            return new WizardIcon($value, true);
        }, $availableGlyphs);
    }

    /**
     * Get the CSS stylesheet content
     */
    protected function getStyleSheetContent(): string
    {
        $path = $this->options['file'] ?? '';
        if (str_starts_with($path, 'EXT:') || str_starts_with($path, 'fileadmin/')) {
            $path = GeneralUtility::getFileAbsFileName($path);
        }
        return GeneralUtility::getUrl($path);
    }

    /**
     * Download font files from font-face rules
     */
    protected function downloadFontFilesOfFontFaceRules(AtRuleSet $rule): void
    {
        foreach ($rule->getRules('src') as $srcRule) {
            $fontFaceSrc = $srcRule->getValue();
            if (!$fontFaceSrc) {
                continue;
            }
            $this->downloadFontFilesOfFontFaceSrc($fontFaceSrc);
        }
    }

    /**
     * Process font-face src values and download font files
     *
     * @param RuleValueList|URL $ruleValue
     */
    protected function downloadFontFilesOfFontFaceSrc($ruleValue): void
    {
        if ($ruleValue instanceof URL) {
            $fontFilePath = $ruleValue->getURL()->getString();
            $fontFileName = $this->downloadFontFile($fontFilePath);
            if (is_string($fontFileName)) {
                $ruleValue->getURL()->setString($fontFileName);
            }
        }

        if ($ruleValue instanceof RuleValueList) {
            foreach ($ruleValue->getListComponents() as $component) {
                $this->downloadFontFilesOfFontFaceSrc($component);
            }
        }
    }

    /**
     * Download a font file and save it to the temp directory
     */
    protected function downloadFontFile(string $fontFilePath): string|false
    {
        $fontFileUrl = self::cleanFilePath($fontFilePath);
        $isRemoteFontPath = GeneralUtility::isValidUrl($fontFileUrl);
        $isRemoteStylesheet = GeneralUtility::isValidUrl($this->options['file']) && !str_starts_with($this->options['file'], 'EXT:');
        $fontFileName = pathinfo($fontFilePath, PATHINFO_BASENAME);

        if ($isRemoteFontPath) {
            $fontFileUrl = $fontFilePath;
        } else {
            if ($isRemoteStylesheet) {
                $fontFileDir = pathinfo($this->options['file'], PATHINFO_DIRNAME);
                $fontFileUrl = $fontFileDir . '/' . $fontFileUrl;
            } else {
                $currentPath = $this->getCurrentPath();
                $fontFileUrl = realpath($currentPath . '/' . self::cleanFilePath($fontFilePath));
            }
        }

        return $this->writeFontFile($fontFileUrl, $fontFileName);
    }

    /**
     * Clean a file path by removing query parameters and fragments
     */
    public static function cleanFilePath($path): string
    {
        $cleanPath = strpos($path, '?') ? substr(
            $path,
            0,
            strpos($path, '?')
        ) : $path;

        return strpos($cleanPath, '#') ? substr(
            $cleanPath,
            0,
            strpos($cleanPath, '#')
        ) : $cleanPath;
    }

    /**
     * Write a font file to the temp directory
     */
    protected function writeFontFile(string $fontFileUrl, string $fontFileName): string|false
    {
        $tempPath = $this->getTempPath();
        $tempFile = $tempPath . '/' . self::cleanFilePath($fontFileName);

        // Skip if file already exists
        if (file_exists($tempFile)) {
            return $fontFileName;
        }

        $fontFileContent = GeneralUtility::getUrl($fontFileUrl) ?: '';
        if (!$fontFileContent) {
            return false;
        }

        GeneralUtility::writeFileToTypo3tempDir($tempFile, $fontFileContent);
        return $fontFileName;
    }

    /**
     * Split a complex CSS selector into its atomic parts
     */
    protected static function splitCssSelector($selector): array
    {
        // First, remove known pseudo-elements
        $selector = preg_replace('/::[a-zA-Z0-9_-]+|:[a-zA-Z0-9_-]+(?=\b)/', '', $selector);

        // Now extract parts (class, ID, attributes, tag names)
        preg_match_all(
            '/(\.[a-zA-Z0-9_-]+|#[a-zA-Z0-9_-]+|\[[^\]]+\]|[a-zA-Z0-9_-]+)/',
            $selector,
            $matches
        );

        return $matches[0] ?? [];
    }

    /**
     * Extract font family name from a rule set
     */
    public static function getFontFamilyNameOfRuleSet(RuleSet $rule): string
    {
        if (!$rule instanceof DeclarationBlock) {
            return '';
        }

        $fontFamilyName = null;

        // Check for font-family property
        $fontFamilyRules = $rule->getRules('font-family');
        if (count($fontFamilyRules) === 1 && $fontFamilyRules[0]->getValue()) {
            $fontFamilyName = $fontFamilyRules[0]->getValue();
        }

        // Check for font shorthand property
        $fontRules = $rule->getRules('font');
        if (!$fontFamilyName && count($fontRules) === 1 && $fontRules[0]->getValue()) {
            $components = $fontRules[0]->getValue()->getListComponents();
            if (count($components) >= 5) {
                $fontFamilyName = $components[4];
            }
        }

        if (!$fontFamilyName) {
            return '';
        }

        // Handle CSSString type
        if ($fontFamilyName instanceof CSSString) {
            return $fontFamilyName->getString();
        }

        // Handle CSS function (e.g., var())
        if ($fontFamilyName instanceof CSSFunction) {
            $cssFunctionParts = $fontFamilyName->getListComponents();
            if (count($cssFunctionParts) === 2) {
                return $cssFunctionParts[1]->getString();
            }
        }

        // Handle string value
        if (is_string($fontFamilyName)) {
            return $fontFamilyName;
        }

        return '';
    }

    /**
     * Extract font weight from a rule set
     */
    protected static function getFontWeightOfRuleSet(RuleSet $rule): string|float
    {
        if (!$rule instanceof DeclarationBlock) {
            return '';
        }

        $fontWeight = null;

        // Check for font-weight property
        $fontWeightRules = $rule->getRules('font-weight');
        if (count($fontWeightRules) === 1 && $fontWeightRules[0]->getValue()) {
            $fontWeight = $fontWeightRules[0]->getValue();
        }

        // Check for font shorthand property
        $fontRules = $rule->getRules('font');
        if (!$fontWeight && count($fontRules) === 1 && $fontRules[0]->getValue()) {
            $components = $fontRules[0]->getValue()->getListComponents();
            if (count($components) >= 3) {
                $fontWeight = $components[2];
            }
        }

        if (!$fontWeight) {
            return '';
        }

        // Handle CSSString type
        if ($fontWeight instanceof CSSString) {
            return $fontWeight->getString();
        }

        // Handle CSS function (e.g., var())
        if ($fontWeight instanceof CSSFunction) {
            $cssFunctionParts = $fontWeight->getListComponents();
            if (count($cssFunctionParts) === 2) {
                return $cssFunctionParts[1]->getString();
            }
        }

        // Handle primitive values
        if (is_string($fontWeight) || is_float($fontWeight)) {
            return $fontWeight;
        }

        return '';
    }

    /**
     * Extract font files from font-face rules
     */
    protected function extractFontFilesFromFontFaces(string $fileExtension, array $fontFaces): array
    {
        $tempPath = $this->getTempPath();

        return array_map(function ($ruleSet) use ($tempPath, $fileExtension) {
            $rules = $ruleSet->getRules('src');

            foreach ($rules as $rule) {
                $values = $rule->getValues();

                foreach ($values as $value) {
                    foreach ($value as $part) {
                        if (is_a($part, RuleValueList::class)) {
                            $partValues = $part->getListComponents();
                            foreach ($partValues as $subPart) {
                                if (is_a($subPart, URL::class) && strpos($subPart->getURL()->getString(), '.' . $fileExtension)) {
                                    $relativePath = self::cleanFilePath($subPart->getURL()->getString());
                                    return $tempPath . '/' . $relativePath;
                                }
                            }
                        }
                        if (is_a($part, URL::class) && strpos($part->getURL()->getString(), '.' . $fileExtension)) {
                            $relativePath = self::cleanFilePath($part->getURL()->getString());
                            return $tempPath . '/' . $relativePath;
                        }
                    }
                }
            }

            return '';
        }, $fontFaces);
    }

    /**
     * Write CSS content to the temp file
     */
    protected function writeTempCss(Document $cssDocument): void
    {
        $tempCssFile = $this->getCssTempFilePath();
        $cssContent = $cssDocument->render(OutputFormat::createCompact());
        GeneralUtility::writeFileToTypo3tempDir($tempCssFile, $cssContent);
    }

    /**
     * Get wizard folders for the icon browser
     */
    public function getWizardFolders(): array
    {
        return $this->getIcons();
    }
}
