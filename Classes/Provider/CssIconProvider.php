<?php

namespace Blueways\BwIcons\Provider;

use Blueways\BwIcons\Utility\SvgReaderUtility;
use Blueways\BwIcons\Utility\TtfReaderUtility;
use Sabberworm\CSS\CSSList\Document;
use Sabberworm\CSS\OutputFormat;
use Sabberworm\CSS\RuleSet\AtRuleSet;
use Sabberworm\CSS\RuleSet\DeclarationBlock;
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
        return Environment::getPublicPath() . '/typo3temp/tx_bwicons/' . $this->getCacheIdentifier() . '/' . $this->getId();
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
                            $absolutePath = $tempPath . '/' . $relativePath;
                            return realpath($absolutePath);
                        }
                    }
                }
            }
            return '';
        }, $fontFaces);
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
        foreach ($allRules as $rule) {
            if (static::ruleIsFontFace($rule)) {
                $fontFaces[] = $rule;
                $this->adjustSrcOfFontFaceRule($rule);
                $tempFile->append($rule);
            }

            if (static::ruleIsAGlyph($rule) && static::glyphIsNotInSet($rule, $cssGlyphs)) {
                $cssGlyphs[] = $rule;
                $tempFile->append($rule);
            }
        }

        // get paths to the svg font files
        $svgFonts = $this->extractFontFilesFromFontFaces('svg', $fontFaces);
        $ttfFonts = $this->extractFontFilesFromFontFaces('ttf', $fontFaces);

        // get different font-families
        $fontFamilies = array_map(static function ($ruleSet) {
            $familyRules = $ruleSet->getRules('font-family');
            $weightRules = $ruleSet->getRules('font-weight');
            $weight = count($weightRules) ? $weightRules[0]->getValue() : '';
            $weight = is_a($weight, Size::class) ? $weight->getSize() : $weight;
            $styleRules = $ruleSet->getRules('font-style');
            return [
                'font-family' => $familyRules[0]->getValue()->getString(),
                'weight' => $weight,
                'style' => count($styleRules) ? $styleRules[0]->getValue() : '',
            ];
        }, $fontFaces);

        // build tab modal markup
        $tabs = [];
        foreach ($fontFamilies as $key => $font) {

            // abort if no svg or ttf font found
            if ($svgFonts[$key]) {
                $fontGlyphs = $svgReaderUtility->getGlyphs($svgFonts[$key]);
            } elseif ($ttfFonts[$key]) {
                $fontGlyphs = $ttfReaderUtility->getGlyphs($ttfFonts[$key]);
            }
            else {
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

            // get statements that use the current font-family
            $fontUsers = [];
            foreach ($allRules as $block) {
                if (!is_a($block, DeclarationBlock::class) || count($block->getRules('font-family')) !== 1) {
                    continue;
                }

                // check font-family
                $fontFamilyRules = $block->getRules('font-family');
                if (count($fontFamilyRules) !== 1 || !$fontFamilyRules[0]->getValue() || !is_a($fontFamilyRules[0]->getValue(),
                        CSSString::class) || $fontFamilyRules[0]->getValue()->getString() !== $font['font-family']) {
                    continue;
                }

                // check font weight
                $fontWeightRules = $block->getRules('font-weight');
                if (count($fontWeightRules)) {
                    $weight = $fontWeightRules[0]->getValue();
                    $weight = is_a($weight, Size::class) ? $weight->getSize() : $weight;
                    if ($weight && $weight !== $font['weight']) {
                        continue;
                    }
                }

                $fontUsers[] = $block;
                $tempFile->append($block);
            }

            // extract prefix class (e.g. "fa"). use first selector that matches
            $fontFamilyPrefix = '';
            $fontFamilyPrefixSelector = false;
            foreach ($fontUsers as $fontUser) {
                if ($fontFamilyPrefix || count($fontUser->getSelectors()) === count($fontGlyphs)) {
                    continue;
                }
                $selectors = $fontUser->getSelectors();
                foreach ($selectors as $selector) {
                    if (!strpos($selector->getSelector(), '[class') && strpos($selector->getSelector(),
                            '.') === 0 && !strpos($selector->getSelector(), ' ')) {
                        $fontFamilyPrefix = substr($selector->getSelector(), 1) . ' ';
                        $fontFamilyPrefixSelector = $selector;
                        break;
                    }
                }
            }

            // extract styles of prefix class (e.g. font-style, font-variant,..)
            if ($fontFamilyPrefixSelector) {
                foreach ($allRules as $block) {
                    if (!is_a($block, DeclarationBlock::class)) {
                        continue;
                    }
                    $selectors = $block->getSelectors();
                    foreach ($selectors as $selector) {
                        if ($selector->getSelector() === $fontFamilyPrefixSelector->getSelector()) {
                            $tempFile->append($block);
                        }
                    }
                }
            }

            // map icons to class names
            $icons = array_map(static function ($declarationBlock) use ($fontFamilyPrefix) {
                return $fontFamilyPrefix . str_replace([':before', '::before', '::after', ':after', '.'], '',
                        $declarationBlock->getSelectors()[0]->getSelector());
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
        $path = $this->options['file'];
        if (!GeneralUtility::isValidUrl($path) || strpos($path, 'EXT:') === 0) {
            $path = GeneralUtility::getFileAbsFileName($path);
        }
        return file_get_contents($path);
    }

    protected static function ruleIsFontFace($rule): bool
    {
        return is_a($rule, AtRuleSet::class) && $rule->atRuleName() === 'font-face';
    }

    protected function adjustSrcOfFontFaceRule(AtRuleSet $rule): void
    {
        foreach ($rule->getRules('src') as $srcRule) {
            if (!$srcRule->getValue()) {
                continue;
            }

            $this->crawlAndHandleUrls($srcRule->getValue());
        }
    }

    protected function crawlAndHandleUrls($ruleValue): void
    {

        if (is_a($ruleValue, URL::class)) {
            $this->handleCssUrl($ruleValue);
        }

        if (is_a($ruleValue, RuleValueList::class)) {
            foreach ($ruleValue->getListComponents() as $component) {
                $this->crawlAndHandleUrls($component);
            }
        }
    }

    protected function handleCssUrl(URL $url)
    {
        if (!is_a($url->getURL(), CSSString::class)) {
            return $url;
        }

        $fontFileUrl = static::cleanFilePath($url->getURL()->getString());

        if (GeneralUtility::isValidUrl($fontFileUrl)) {
            $file_headers = @get_headers($fontFileUrl);
            if (strpos($file_headers[0], '404')) {
                return 0;
            }
            $fontFilePath = $fontFileUrl;
        } else {
            $currentPath = $this->getCurrentPath();
            $fontFilePath = realpath($currentPath . '/' . static::cleanFilePath($url->getURL()->getString()));
            if (!file_exists($fontFilePath)) {
                return 0;
            }
        }

        $tempPath = $this->getTempPath();
        $fontFileName = pathinfo($url->getURL()->getString(), PATHINFO_BASENAME);
        $tempFile = $tempPath . '/' . static::cleanFilePath($fontFileName);
        GeneralUtility::writeFileToTypo3tempDir($tempFile, file_get_contents($fontFilePath));

        $url->getURL()->setString($fontFileName);
    }

    public function getCurrentPath(): string
    {
        $path = $this->options['file'];
        if (!GeneralUtility::isValidUrl($path) || strpos($path, 'EXT:') === 0) {
            $path = GeneralUtility::getFileAbsFileName($path);
        }
        return pathinfo($path, PATHINFO_DIRNAME);
    }

    /**
     * remove possible #fontawesome and ?version at end of string
     *
     * @param $path
     * @return false|string
     */
    public static function cleanFilePath($path)
    {
        $cleanPath = strpos($path, '?') ? substr($path, 0,
            strpos($path, '?')) : $path;
        return strpos($cleanPath, '#') ? substr($cleanPath, 0,
            strpos($cleanPath, '#')) : $cleanPath;
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
        if (!$contentRule || !$contentRule->getValue() || !is_a($contentRule->getValue(),
                CSSString::class) || !$contentRule->getValue()->getString() || $contentRule->getValue()->getString() === '') {
            return false;
        }
        // validate selector (is class and has :before or :after)
        $selector = $declarationBlock->getSelectors()[0]->getSelector();
        if (strlen($selector) < 7 || strpos($selector, '.') !== 0) {
            return false;
        }
        return strpos($selector, ':before', -7) || strpos($selector, ':after', -6);
    }

    protected function writeTempCss(Document $cssDocument): void
    {
        $tempCssFile = $this->getCssTempFilePath();
        $cssContent = $cssDocument->render(OutputFormat::createCompact());
        GeneralUtility::writeFileToTypo3tempDir($tempCssFile, $cssContent);
    }
}
