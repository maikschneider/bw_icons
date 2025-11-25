<?php

namespace Blueways\BwIcons\ViewHelpers;

use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class IsWhiteViewHelper extends AbstractViewHelper
{
    /**
     * Registers the view helper arguments.
     *
     * Registers a required `icon` argument containing the icon name.
     */
    public function initializeArguments(): void
    {
        $this->registerArgument('icon', 'string', 'The icon name', true);
    }

    /**
     * Determines whether the configured icon name contains the substring "white" at a non-zero position.
     *
     * Returns `true` if the substring "white" appears in the icon name at a position greater than zero; `false` if it is absent or located at the start (position 0).
     *
     * @return bool `true` if 'white' is found at a non-zero position, `false` otherwise.
     */
    public function render()
    {
        return (bool)strpos($this->arguments['icon'], 'white');
    }
}
