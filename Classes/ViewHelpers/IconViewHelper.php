<?php

namespace Blueways\BwIcons\ViewHelpers;

use Blueways\BwIcons\Utility\HelperUtility;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

class IconViewHelper extends AbstractTagBasedViewHelper
{

    protected $tagName = 'img';

    public function render(): string
    {
        $this->tag->addAttribute('data-icon-name', $this->arguments['icon']);
        /** @var HelperUtility $helperUtility */
        $helperUtility = GeneralUtility::makeInstance(HelperUtility::class);

        if ($helperUtility->isFileIconProvider($this->arguments['provider'])) {
            $path = GeneralUtility::getFileAbsFileName($this->arguments['icon']);
            $webPath = '/' . substr(PathUtility::getRelativePath(Environment::getPublicPath(), $path), 0, -1);
            $this->tag->addAttribute('src', $webPath);
            $this->tag->addAttribute('loading', 'lazy');
            return $this->tag->render();
        }

        $this->tagName = $helperUtility->getTagName($this->arguments['provider']);

        return $this->tag->render();
    }

    public function initializeArguments()
    {
        parent::initializeArguments();
        $this->registerArgument('icon', 'string', 'The icon name', true);
        $this->registerArgument('provider', 'string', 'PageTS did of the used IconProvider', true);
    }
}
