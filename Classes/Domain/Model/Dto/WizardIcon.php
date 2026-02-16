<?php

namespace Blueways\BwIcons\Domain\Model\Dto;

use TYPO3\CMS\Core\Utility\PathUtility;

class WizardIcon
{
    public string $imgSrc = '';

    public string $title = '';

    public ?string $markup = null;

    public function __construct(public string $value, public ?bool $isFontIcon = null)
    {
        $this->setImgSrcFromValue();
        $this->setTitleFromValue();
        $this->guessIsFontIcon();
    }

    public function setImgSrcFromValue(): void
    {
        $fileadminDir = $GLOBALS['TYPO3_CONF_VARS']['BE']['fileadminDir'] ?? 'fileadmin/';
        if (str_starts_with($this->value, (string)$fileadminDir)) {
            $this->imgSrc = '/' . $this->value;
        }
        if (str_starts_with($this->value, 'EXT:')) {
            $this->imgSrc = PathUtility::getPublicResourceWebPath($this->value);
        }
    }

    public function setTitleFromValue(): void
    {
        if ($this->imgSrc) {
            $this->title = pathinfo($this->imgSrc, PATHINFO_FILENAME);
            return;
        }

        $this->title = $this->value;
    }

    private function guessIsFontIcon(): void
    {
        if ($this->isFontIcon !== null) {
            return;
        }

        if ($this->imgSrc !== '') {
            $this->isFontIcon = false;
            return;
        }

        if (str_contains($this->value, ' ') && !str_contains($this->value, '.')) {
            $this->isFontIcon = true;
        }
    }
}
