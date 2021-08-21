<?php

namespace Blueways\BwIcons\ViewHelpers;

use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

class IconViewHelper extends AbstractTagBasedViewHelper
{

    protected $tagName = 'img';

    public function render()
    {
        if (strpos($this->arguments['icon'], 'EXT:') === 0) {
            $path = GeneralUtility::getFileAbsFileName($this->arguments['icon']);
            $webPath = '/' . substr(PathUtility::getRelativePath(Environment::getPublicPath(), $path), 0, -1);
            $this->tag->addAttribute('src', $webPath);
        }

        return $this->tag->render();
    }

    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('icon', 'string', 'The icon name', true);
    }
}
