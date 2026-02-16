<?php

namespace Blueways\BwIcons\Provider;

use Blueways\BwIcons\Domain\Model\Dto\WizardFolder;

abstract class AbstractIconProvider
{
    protected string $title = '';

    protected string $id = '';

    protected string $cacheIdentifier = '';

    public function __construct(protected array $options)
    {
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function getCacheIdentifier(): string
    {
        return $this->cacheIdentifier;
    }

    public function setCacheIdentifier(string $cacheIdentifier): void
    {
        $this->cacheIdentifier = $cacheIdentifier;
    }

    abstract public function getIcons(): array;

    /**
     * @return WizardFolder[]
     */
    abstract public function getWizardFolders(): array;

    public function getStyleSheet(): ?string
    {
        return null;
    }

    public function getMarkup(): ?string
    {
        return $this->options['markup'] ?? null;
    }
}
