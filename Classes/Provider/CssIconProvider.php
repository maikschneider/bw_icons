<?php

namespace Blueways\BwIcons\Provider;

use Sabberworm\CSS\RuleSet\AtRuleSet;
use Sabberworm\CSS\RuleSet\DeclarationBlock;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class CssIconProvider extends AbstractIconProvider
{

    public function getIcons(): array
    {
        $typo3Path = $this->options['file'];
        $path = GeneralUtility::getFileAbsFileName($typo3Path);

        $parser = new \Sabberworm\CSS\Parser(file_get_contents($path));
        $cssDocument = $parser->parse();
        $allRules = $cssDocument->getAllRuleSets();

        $fontFaces = array_filter($allRules, function ($rule) {
            return is_a($rule, AtRuleSet::class) && $rule->atRuleName() === 'font-face';
        });
        $fontFamilies = array_map(function ($ruleSet) {
            $rules = $ruleSet->getRules('font-family');
            return $rules[0]->getValue();
        }, $fontFaces);

        $cssGlyphs = array_filter($allRules, function ($declarationBlock) {
            if (!is_a($declarationBlock, DeclarationBlock::class) || count($declarationBlock->getSelectors()) !== 1) {
                return false;
            }
            $selector = $declarationBlock->getSelectors()[0]->getSelector();
            if (strlen($selector) < 7) {
                return false;
            }
            return strpos($selector, ':before', -7) || strpos($selector, ':after', -6);
        });

        return [];

        $icons = [];
        $typo3Path = $this->options['folder'];
        $path = GeneralUtility::getFileAbsFileName($typo3Path);
        $folders = GeneralUtility::get_dirs($path);

        // icons in root dir
        $icons[] = GeneralUtility::getFilesInDir($path);
        $icons[0] = array_map(static function ($icon) use ($typo3Path) {
            return $typo3Path . '/' . $icon;
        }, $icons[0]);

        // icons in sub dirs
        foreach ($folders as $folder) {
            $folderIcons = GeneralUtility::getFilesInDir($path . '/' . $folder);
            $folderIcons = array_map(static function ($icon) use ($folder, $typo3Path) {
                return $typo3Path . '/' . $folder . '/' . $icon;
            }, $folderIcons);
            $icons[ucfirst($folder)] = $folderIcons;
        }

        return $icons;
    }
}
