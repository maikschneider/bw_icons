<?php

namespace Blueways\BwIcons\ViewHelpers;

use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class IconViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    public static function renderStatic(
        array $arguments,
        \Closure $renderChildrenClosure,
        RenderingContextInterface $renderingContext
    ) {
        $attributes = [];
        $attributes['data-icon-name'] = $arguments['icon'];
        $attributes['data-icon-base-name'] = $arguments['icon'];

        if (isset($arguments['additionalAttributes'])) {
            foreach ($arguments['additionalAttributes'] as $additionalAttributeName => $value) {
                $attributes['data-' . $additionalAttributeName] = $value;
            }
        }

        if (strpos($arguments['icon'], '.')) {
            $path = GeneralUtility::getFileAbsFileName($arguments['icon']);
            $webPath = PathUtility::getAbsoluteWebPath($path);

            $extension = pathinfo($path, PATHINFO_EXTENSION);
            $baseName = basename($path, '.' . $extension);

            $attributes['data-icon-base-name'] = $baseName;
            $attributes['src'] = $webPath;
            $attributes['loading'] = 'lazy';
            $attributes['alt'] = '';
            $attributes['role'] = 'presentation';

            $attrString = static::concatAttributes($attributes);
            return '<img ' . $attrString . ' />';
        }

        $attributes['class'] = $arguments['icon'];
        $attrString = static::concatAttributes($attributes);
        return '<i ' . $attrString . '></i>';
    }

    protected static function concatAttributes(array $attributes): string
    {
        return implode(' ', array_map(static function ($key) use ($attributes) {
            return $key . '="' . $attributes[$key] . '"';
        }, array_keys($attributes)));
    }

    public function initializeArguments(): void
    {
        parent::initializeArguments();
        $this->registerArgument('icon', 'string', 'The icon name', true);
        $this->registerArgument('provider', 'string', 'PageTS did of the used IconProvider', false);
        $this->registerArgument(
            'additionalAttributes',
            'array',
            'Additional tag attributes. They will be added directly to the resulting HTML tag.',
            false
        );
    }
}
