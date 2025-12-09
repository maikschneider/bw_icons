<?php

namespace Blueways\BwIcons\ViewHelpers;

use DOMDocument;
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

        if (str_contains((string)$arguments['icon'], '.')) {
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

        $markup = $arguments['markup'] ?: '<i class="###ICON###"></i>';
        $markup = str_replace('###ICON###', $arguments['icon'], $markup);

        $doc = new DOMDocument();
        $doc->loadHTML($markup, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $element = $doc->getElementsByTagName('*')->item(0);
        foreach ($attributes as $attributeName => $attributeValue) {
            $element->setAttribute($attributeName, $attributeValue);
        }

        return $doc->saveHTML() ?: '';
    }

    protected static function concatAttributes(array $attributes): string
    {
        return implode(' ', array_map(static fn ($key) => $key . '="' . $attributes[$key] . '"', array_keys($attributes)));
    }

    public function initializeArguments(): void
    {
        parent::initializeArguments();
        $this->registerArgument('icon', 'string', 'The icon name', true);
        $this->registerArgument(
            'markup',
            'string',
            'Markup of the icon. Use ###ICON### as placeholder for the icon name.',
            false,
            ''
        );
        $this->registerArgument(
            'additionalAttributes',
            'array',
            'Additional tag attributes. They will be added directly to the resulting HTML tag.',
            false
        );
    }
}
