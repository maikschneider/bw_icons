<?php

namespace Blueways\BwIcons\Factory;

use Blueways\BwIcons\Provider\AbstractIconProvider;
use Blueways\BwIcons\Provider\CssIconProvider;
use Blueways\BwIcons\Utility\SvgReaderUtility;
use Blueways\BwIcons\Utility\TtfReaderUtility;

class IconProviderFactory
{
    public function __construct(
        private readonly SvgReaderUtility $svgReaderUtility,
        private readonly TtfReaderUtility $ttfReaderUtility
    ) {
    }

    public function create(string $className, array $options): AbstractIconProvider
    {
        if ($className === CssIconProvider::class) {
            return new CssIconProvider($options, $this->svgReaderUtility, $this->ttfReaderUtility);
        }

        return new $className($options);
    }
}
