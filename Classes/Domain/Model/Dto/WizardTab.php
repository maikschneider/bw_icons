<?php

namespace Blueways\BwIcons\Domain\Model\Dto;

class WizardTab
{
    public string $id = '';

    public string $title = '';

    /**
     * @var WizardFolder[]
     */
    public array $folders = [];

    public ?string $stylesheet = null;
}
