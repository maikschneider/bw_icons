<?php

namespace Blueways\BwIcons\Provider;

abstract class AbstractIconProvider
{

    protected array $options = [];

    public function __construct($options)
    {
        $this->options = $options;
    }

    abstract public function getIcons(): array;
}
