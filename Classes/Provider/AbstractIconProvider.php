<?php

namespace Blueways\BwIcons\Provider;

abstract class AbstractIconProvider
{

    protected string $title = '';

    protected string $id = '';

    protected string $cacheIdentifier = '';

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
    }

    /**
     * @param string $id
     */
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    /**
     * @return string
     */
    public function getCacheIdentifier(): string
    {
        return $this->cacheIdentifier;
    }

    /**
     * @param string $cacheIdentifier
     */
    public function setCacheIdentifier(string $cacheIdentifier): void
    {
        $this->cacheIdentifier = $cacheIdentifier;
    }

    protected array $options = [];

    public function __construct($options)
    {
        $this->options = $options;
    }

    abstract public function getIcons(): array;
}
