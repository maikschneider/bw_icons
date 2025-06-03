<?php

namespace Blueways\BwIcons\Domain\Model\Dto;

use TYPO3\CMS\Core\Utility\PathUtility;

class WizardIcon
{
    public string $value = '';

    public string $imgSrc = '';

    public string $title = '';

    public ?bool $isFontIcon = null;

    public function __construct(string $value, ?bool $isFontIcon = null)
    {
        $this->value = $value;
        $this->isFontIcon = $isFontIcon;

        $this->setImgSrcFromValue();
        $this->setTitleFromValue();
        $this->guessIsFontIcon();
    }

    public function setImgSrcFromValue(): void
    {
        if (str_starts_with($this->value, 'fileadmin/')) {
            $this->imgSrc = '/' . $this->value;
        }
        if (str_starts_with($this->value, 'EXT:')) {
            $this->imgSrc = PathUtility::getPublicResourceWebPath($this->value);
        }
    }

    public function setTitleFromValue(): void
    {
        $this->title = pathinfo($this->imgSrc, PATHINFO_FILENAME);
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
