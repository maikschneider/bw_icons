<?php

namespace Blueways\BwIcons\Provider;

use Blueways\BwIcons\Utility\SvgReaderUtility;
use Sabberworm\CSS\RuleSet\AtRuleSet;
use Sabberworm\CSS\RuleSet\DeclarationBlock;
use Sabberworm\CSS\Value\URL;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class CssIconProvider extends AbstractIconProvider
{

    public function getIcons(): array
    {
        $typo3Path = $this->options['file'];
        $path = GeneralUtility::getFileAbsFileName($typo3Path);
        $folderDir = pathinfo($path, PATHINFO_DIRNAME);
        /** @var SvgReaderUtility $svgReaderUtility */
        $svgReaderUtility = GeneralUtility::makeInstance(SvgReaderUtility::class);

        $parser = new \Sabberworm\CSS\Parser(file_get_contents($path));
        $cssDocument = $parser->parse();
        $allRules = $cssDocument->getAllRuleSets();

        // extract @font-face declaration
        $fontFaces = array_filter($allRules, function ($rule) {
            return is_a($rule, AtRuleSet::class) && $rule->atRuleName() === 'font-face';
        });

        // get paths to the svg font files
        $svgFonts = array_map(function ($ruleSet) use ($folderDir) {
            $rules = $ruleSet->getRules('src');
            foreach ($rules as $rule) {
                $values = $rule->getValues();
                foreach ($values as $value) {
                    foreach ($value as $part) {
                        if (is_a($part, URL::class) && strpos($part->getURL()->getString(), '.svg')) {
                            // combine relative path with absolute path from css file
                            // remove possible #fontawesome at end
                            // merge paths
                            $relativePath = $part->getURL()->getString();
                            $absolutePath = $folderDir . '/' . $relativePath;
                            return realpath(substr($absolutePath, 0, strpos($absolutePath, '#')));
                        }
                    }
                }
            }
            return '';
        }, $fontFaces);

        // get different font-families
        $fontFamilies = array_map(function ($ruleSet) {
            $rules = $ruleSet->getRules('font-family');
            return $rules[0]->getValue();
        }, $fontFaces);

        // extract all css classes that probably display icons
        $cssGlyphs = array_filter($allRules, function ($declarationBlock) {
            // validate that declaration has content property and exactly one selector
            if (!is_a($declarationBlock, DeclarationBlock::class)
                || count($declarationBlock->getSelectors()) !== 1
                || count($declarationBlock->getRules('content')) !== 1
            ) {
                return false;
            }
            // validate content-property (exists and is not "")
            $contentRule = $declarationBlock->getRules('content')[0];
            if (!$contentRule || !$contentRule->getValue() || !$contentRule->getValue()->getString() || $contentRule->getValue()->getString() === '') {
                return false;
            }
            // validate selector (is class and has :before or :after)
            $selector = $declarationBlock->getSelectors()[0]->getSelector();
            if (strlen($selector) < 7 || strpos($selector, '.') !== 0) {
                return false;
            }
            return strpos($selector, ':before', -7) || strpos($selector, ':after', -6);
        });

        // build tab modal markup
        $tabs = [];
        foreach ($fontFamilies as $key => $family) {

            // filter glyphs for the ones in font file
            $fontGlyphs = $svgReaderUtility->getGlyphs($svgFonts[$key]);
            $availableGlyphs = array_filter($cssGlyphs, function ($cssGlyph) use ($fontGlyphs) {
                $rules = $cssGlyph->getRules('content');
                $glyphString = $rules[0]->getValue()->getString();
                return in_array($glyphString, $fontGlyphs, true);
            });

            // map icons to class names
            $icons = array_map(function ($declarationBlock) {
                // @TODO check if glyph is in that font face (via svg font lookup)
                return str_replace([':before', ':after', '.'], '', $declarationBlock->getSelectors()[0]->getSelector());
            }, $availableGlyphs);

            $fontName = $family->getString();

            $tabs[$fontName] = $icons;
        }

        return $tabs;
    }
}
