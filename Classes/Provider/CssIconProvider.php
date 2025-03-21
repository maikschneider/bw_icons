<?php

namespace Blueways\BwIcons\Provider;

use Blueways\BwIcons\Utility\SvgReaderUtility;
use Blueways\BwIcons\Utility\TtfReaderUtility;
use Sabberworm\CSS\CSSList\Document;
use Sabberworm\CSS\OutputFormat;
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
    public function __construct($options)
    {
        parent::__construct($options);

        if (!class_exists('\Sabberworm\CSS\CSSList\Document')) {
            @include 'phar://' . ExtensionManagementUtility::extPath('bw_icons') . 'Libraries/sabberworm-php-css-parser.phar/vendor/autoload.php';
        }
    }

    public function getStyleSheet(): string
    {
        if (!$this->tempFileExist()) {
            @$this->getIcons();
        }
        $tempFile = $this->getCssTempFilePath();
        return '/' . substr(PathUtility::getRelativePath(Environment::getPublicPath(), $tempFile), 0, -1);
    }

    public function tempFileExist(): bool
    {
        $tempCssFile = $this->getCssTempFilePath();
        return file_exists($tempCssFile);
    }

    public function getCssTempFilePath(): string
    {
        $tempPath = $this->getTempPath();
        return $tempPath . '/font.css';
    }

    public function getTempPath(): string
    {
        return Environment::getPublicPath() . '/typo3temp/assets/tx_bwicons/' . $this->getCacheIdentifier() . '/' . $this->getId();
    }

    public function getIcons(): array
    {
        /** @var SvgReaderUtility $svgReaderUtility */
        $svgReaderUtility = GeneralUtility::makeInstance(SvgReaderUtility::class);
        /** @var TtfReaderUtility $ttfReaderUtility */
        $ttfReaderUtility = GeneralUtility::makeInstance(TtfReaderUtility::class);
        $tempFile = new Document();
        $styleSheetContent = $this->getStyleSheetContent();

        $parser = new \Sabberworm\CSS\Parser($styleSheetContent);
        $cssDocument = $parser->parse();
        $allRules = $cssDocument->getAllRuleSets();

        $fontFaces = [];
        $cssGlyphs = [];
        $rulesUsingFontFamily = [];
        foreach ($allRules as $rule) {
            if (is_a($rule, AtRuleSet::class) && $rule->atRuleName() === 'font-face') {
                $fontFaces[] = $rule;
                $this->downloadFontFilesOfFontFaceRules($rule);
                $tempFile->append($rule);
            }

            if (static::ruleIsAGlyph($rule) && static::glyphIsNotInSet($rule, $cssGlyphs)) {
                $cssGlyphs[] = $rule;
                $tempFile->append($rule);
            }

            if (static::ruleUsesFontFamily($rule)) {
                $rulesUsingFontFamily[] = $rule;
            }
        }

        // filter for font-faces that are really used
        $fontFaces = array_filter($fontFaces, function ($fontFace) use ($rulesUsingFontFamily) {
            $fontFamilyName = $fontFace->getRules('font-family')[0]->getValue()->getString();
            foreach ($rulesUsingFontFamily as $ruleUsingFontFamily) {
                if (self::cssBlockMatchesFontFamily($ruleUsingFontFamily, $fontFamilyName)) {
                    return true;
                }
            }
            return false;
        });

        // get paths to the svg font files
        $svgFonts = $this->extractFontFilesFromFontFaces('svg', $fontFaces);
        $ttfFonts = $this->extractFontFilesFromFontFaces('ttf', $fontFaces);

        // get different font-families
        $fontFamilies = array_map(static function ($ruleSet) {
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

        // build tab modal markup
        $tabs = [];
        $fontFamilyPrefix = '';
        foreach ($fontFamilies as $key => $font) {
            // abort if no svg or ttf font found
            if ($svgFonts[$key]) {
                $fontGlyphs = $svgReaderUtility->getGlyphs($svgFonts[$key]);
            } elseif ($ttfFonts[$key]) {
                $fontGlyphs = $ttfReaderUtility->getGlyphs($ttfFonts[$key]);
            } else {
                continue;
            }

            // filter glyphs for the ones in font file
            $availableGlyphs = array_filter($cssGlyphs, static function ($cssGlyph) use ($fontGlyphs) {
                $rules = $cssGlyph->getRules('content');
                $glyphString = $rules[0]->getValue()->getString();
                return in_array($glyphString, $fontGlyphs, true);
            });

            // rename font family for tab array in case of duplicate font names
            $fontName = $font['font-family'];
            if (count(array_filter($fontFamilies, static function ($fontFamily) use ($font) {
                return $fontFamily['font-family'] === $font['font-family'];
            })) > 1) {
                $fontName = $font['font-family'] . ' ' . $font['weight'];
            }

            // get statements that use current font-family
            foreach ($rulesUsingFontFamily as $block) {
                if (!self::cssBlockMatchesFontFamily($block, $font['font-family'])) {
                    continue;
                }

                // @TODO: What does this block check? Maybe if selector is in every glyphe?
                if (count($block->getSelectors()) === count($fontGlyphs)) {
                    continue;
                }

                // extract prefix class (e.g. ".fab .fa-brand")
                $validSelectors = [];
                foreach ($block->getSelectors() as $selector) {
                    $selectorString = $selector->getSelector();

                    // check that selector matches requirements
                    $selectorContainsClassAttr = str_contains($selectorString, '[class');
                    $isClassSelector = str_starts_with($selectorString, '.');
                    $selectorContainsSpace = str_contains($selectorString, ' ');

                    if ($selectorContainsClassAttr || !$isClassSelector || $selectorContainsSpace) {
                        continue;
                    }

                    $validSelectors[] = $selector;
                }

                // collect all styles of valid selectors, then back-check if they match current font-family + weight
                $selectorBlockToCheck = [];
                foreach ($allRules as $block) {
                    if (!is_a($block, DeclarationBlock::class)) {
                        continue;
                    }
                    $selectors = (array)$block->getSelectors();
                    foreach ($selectors as $selector) {
                        if (!in_array($selector, $validSelectors)) {
                            continue;
                        }
                        $selectorBlockToCheck[$selector->getSelector()] ??= [];
                        $selectorBlockToCheck[$selector->getSelector()][] = $block;
                    }
                }

                // if rule has desired font-family
                // if rule has desired font-weight
                // use last selectorName as prefix + add all rules to css
                foreach ($selectorBlockToCheck as $selectorName => $blocks) {
                    $fontFamilyMatches = $fontWeightMatches = false;
                    foreach ($blocks as $blockRule) {
                        if (self::cssBlockMatchesFontFamily($blockRule, $font['font-family'])) {
                            $fontFamilyMatches = true;
                        }
                        if (self::cssBlockMatchesFontWeight($blockRule, $font['weight'])) {
                            $fontWeightMatches = true;
                        }
                    }

                    if ($fontFamilyMatches && $fontWeightMatches) {
                        $fontFamilyPrefix = substr($selectorName, 1) . ' ';
                        foreach ($blocks as $blockRule) {
                            $tempFile->append($blockRule);
                        }
                    }
                }
            }

            // map icons to class names
            $icons = array_map(static function ($declarationBlock) use ($fontFamilyPrefix) {
                return $fontFamilyPrefix . str_replace(
                    ['::before', ':before', '::after', ':after', '.'],
                    '',
                    $declarationBlock->getSelectors()[0]->getSelector()
                );
            }, $availableGlyphs);
            $icons = array_values($icons);

            $tabs[$fontName] = $icons;
        }

        $this->writeTempCss($tempFile);

        // remove array offset (font-family name) if only one tab
        if (count($fontFamilies) === 1) {
            $singleTab = array_reverse($tabs);
            $singleTab = array_pop($singleTab);
            return [$singleTab];
        }

        return $tabs;
    }

    protected function getStyleSheetContent(): string
    {
        $path = $this->options['file'] ?? '';
        if (str_starts_with($path, 'EXT:') || str_starts_with($path, 'fileadmin/')) {
            $path = GeneralUtility::getFileAbsFileName($path);
        }
        return GeneralUtility::getUrl($path);
    }

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
     * @param RuleValueList|URL $ruleValue
     */
    protected function downloadFontFilesOfFontFaceSrc($ruleValue): void
    {
        if (is_a($ruleValue, URL::class)) {
            $fontFilePath = $ruleValue->getURL()->getString();
            $fontFileName = $this->downloadFontFile($fontFilePath);
            if (is_string($fontFileName)) {
                $ruleValue->getURL()->setString($fontFileName);
            }
        }

        if (is_a($ruleValue, RuleValueList::class)) {
            foreach ($ruleValue->getListComponents() as $component) {
                $this->downloadFontFilesOfFontFaceSrc($component);
            }
        }
    }

    protected function downloadFontFile(string $fontFilePath): string|false
    {
        $fontFileUrl = static::cleanFilePath($fontFilePath);
        $isRemoteFontPath = GeneralUtility::isValidUrl($fontFileUrl);
        $isRemoteStylesheet = GeneralUtility::isValidUrl($this->options['file']) && strpos($path, 'EXT:') != 0;
        $fontFileName = pathinfo($fontFilePath, PATHINFO_BASENAME);

        if ($isRemoteFontPath) {
            $fontFileUrl = $fontFilePath;
        } else {
            if ($isRemoteStylesheet) {
                $fontFileDir = pathinfo($this->options['file'], PATHINFO_DIRNAME);
                $fontFileUrl = $fontFileDir . '/' . $fontFileUrl;
            } else {
                $currentPath = $this->getCurrentPath();
                $fontFileUrl = realpath($currentPath . '/' . static::cleanFilePath($fontFilePath));
            }
        }

        return $this->writeFontFile($fontFileUrl, $fontFileName);
    }

    /**
     * remove possible #fontawesome and ?version at end of string
     *
     * @param $path
     * @return string
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

    public function getCurrentPath(): string
    {
        $path = $this->options['file'];
        if (!GeneralUtility::isValidUrl($path) || strpos($path, 'EXT:') === 0) {
            $path = GeneralUtility::getFileAbsFileName($path);
        }
        return pathinfo($path, PATHINFO_DIRNAME);
    }

    protected function writeFontFile(string $fontFileUrl, string $fontFileName): string|false
    {
        $tempPath = $this->getTempPath();
        $tempFile = $tempPath . '/' . static::cleanFilePath($fontFileName);

        // @TODO: Handle cache
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

    protected static function ruleIsAGlyph($declarationBlock): bool
    {
        // validate that declaration has content property and exactly one selector
        if (!is_a($declarationBlock, DeclarationBlock::class)
            || count($declarationBlock->getSelectors()) !== 1
            || count($declarationBlock->getRules('content')) !== 1
        ) {
            return false;
        }
        // validate content-property (exists and is not "")
        $contentRule = $declarationBlock->getRules('content')[0];
        if (!$contentRule || !$contentRule->getValue() || !is_a(
            $contentRule->getValue(),
            CSSString::class
        ) || !$contentRule->getValue()->getString() || $contentRule->getValue()->getString() === '') {
            return false;
        }
        // validate selector (is class and has :before or :after)
        $selector = $declarationBlock->getSelectors()[0]->getSelector();
        if (strlen($selector) < 7 || strpos($selector, '.') !== 0) {
            return false;
        }
        return strpos($selector, ':before', -7) || strpos($selector, ':after', -6);
    }

    private static function glyphIsNotInSet(DeclarationBlock $cssGlyph, array $cssGlyphs): bool
    {
        $contentRules = $cssGlyph->getRules('content');
        $glyphString = $contentRules[0]->getValue()->getString();
        foreach ($cssGlyphs as $setRule) {
            $contentRules = $setRule->getRules('content');
            $glyphStringInSet = $contentRules[0]->getValue()->getString();
            if ($glyphString === $glyphStringInSet) {
                return false;
            }
        }
        return true;
    }

    protected static function ruleUsesFontFamily($rule): bool
    {
        if (is_a($rule, DeclarationBlock::class)
            && count($rule->getRules('font-family'))
        ) {
            return true;
        }
        return false;
    }

    protected static function cssBlockMatchesFontFamily(RuleSet $ruleSet, string $fontFamilyName): bool
    {
        // check for font-family declaration
        $fontFamilyRules = $ruleSet->getRules('font-family');
        if (count($fontFamilyRules) !== 1 || !$fontFamilyRules[0]->getValue()) {
            return false;
        }

        // check for css value (e.g. font-family: "Font Awesome")
        if (is_a($fontFamilyRules[0]->getValue(), CSSString::class)
            && $fontFamilyRules[0]->getValue()->getString() === $fontFamilyName) {
            return true;
        }

        // check for css function and try to resolve by default value (font-family: var(--family-name, Font-Awesome)
        if (is_a($fontFamilyRules[0]->getValue(), CSSFunction::class)) {
            $cssFunctionParts = $fontFamilyRules[0]->getValue()->getListComponents();
            if (count($cssFunctionParts) === 2 && $cssFunctionParts[1]->getString() === $fontFamilyName) {
                return true;
            }
        }

        return false;
    }

    protected function extractFontFilesFromFontFaces(string $fileExtension, array $fontFaces): array
    {
        $tempPath = $this->getTempPath();
        return array_map(static function ($ruleSet) use ($tempPath, $fileExtension) {
            $rules = $ruleSet->getRules('src');
            foreach ($rules as $rule) {
                $values = $rule->getValues();
                foreach ($values as $value) {
                    foreach ($value as $part) {
                        if (is_a($part, URL::class) && strpos($part->getURL()->getString(), '.' . $fileExtension)) {
                            // combine relative path with absolute path from css file
                            // merge paths
                            $relativePath = static::cleanFilePath($part->getURL()->getString());
                            return $tempPath . '/' . $relativePath;
                        }
                    }
                }
            }
            return '';
        }, $fontFaces);
    }

    protected static function cssBlockMatchesFontWeight(RuleSet $ruleSet, float $fontWeight): bool
    {
        // check for font weight declaration
        $fontWeightRules = $ruleSet->getRules('font-weight');
        if (!count($fontWeightRules)) {
            return false;
        }

        // check for css value (e.g. font-weight: 400)
        $weight = $fontWeightRules[0]->getValue();
        if (is_a($weight, Size::class) && $weight->getSize() === $fontWeight) {
            return true;
        }

        // check for css function and try to resolve by default value (font-weight: var(--font-weight, 900))
        if (is_a($weight, CSSFunction::class)) {
            $cssFunctionParts = $weight->getListComponents();
            if (count($cssFunctionParts) === 2
                && is_a($cssFunctionParts[1], Size::class)
                && $cssFunctionParts[1]->getSize() === $fontWeight
            ) {
                return true;
            }
        }

        return false;
    }

    protected function writeTempCss(Document $cssDocument): void
    {
        $tempCssFile = $this->getCssTempFilePath();
        $cssContent = $cssDocument->render(OutputFormat::createCompact());
        GeneralUtility::writeFileToTypo3tempDir($tempCssFile, $cssContent);
    }
}
