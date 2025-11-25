<?php

namespace Blueways\BwIcons\ViewHelpers;

use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class IsWhiteViewHelper extends AbstractViewHelper
{
    public function initializeArguments(): void
    {
        $this->registerArgument('icon', 'string', 'The icon name', true);
    }

    public function render()
    {
        return (bool)strpos($this->arguments['icon'], 'white');
    }
}
