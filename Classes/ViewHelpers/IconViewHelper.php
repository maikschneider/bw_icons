<?php

namespace Blueways\BwIcons\ViewHelpers;

use DOMDocument;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;
use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

class IconViewHelper extends AbstractViewHelper
{
    protected $escapeOutput = false;

    /**
     * Register view helper arguments used to render an icon.
     *
     * Registers three arguments:
     * - `icon` (string, required): Icon name or path.
     * - `markup` (string, optional): HTML template containing `###ICON###` as placeholder; defaults to an empty string.
     * - `additionalAttributes` (array, optional): Additional attributes that will be added to the resulting HTML element as data-attributes.
     */
    public function initializeArguments(): void
    {
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

    /**
     * Render an icon either as an <img> element for file paths or as provided HTML markup with data attributes.
     *
     * Builds `data-` attributes (including `data-icon-name` and `data-icon-base-name`), merges any additional attributes,
     * and if the icon string contains a dot treats it as a file path — resolving it to a web path and returning an `<img>` tag
     * with `src`, `loading="lazy"`, `alt=""`, and `role="presentation"`. If the icon is not a file path, replaces the
     * `###ICON###` placeholder in the provided markup (or the default `<i class="###ICON###"></i>`) with the icon name,
     * applies the collected attributes to the first element, and returns the serialized HTML.
     *
     * @return string The rendered HTML for the icon.
     */
    public function render()
    {
        $attributes = [];
        $attributes['data-icon-name'] = $this->arguments['icon'];
        $attributes['data-icon-base-name'] = $this->arguments['icon'];

        if (isset($this->arguments['additionalAttributes'])) {
            foreach ($this->arguments['additionalAttributes'] as $additionalAttributeName => $value) {
                $attributes['data-' . $additionalAttributeName] = $value;
            }
        }

        if (strpos($this->arguments['icon'], '.')) {
            $path = GeneralUtility::getFileAbsFileName($this->arguments['icon']);
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

        $markup = $this->arguments['markup'] ?: '<i class="###ICON###"></i>';
        $markup = str_replace('###ICON###', $this->arguments['icon'], $markup);

        $doc = new DOMDocument();
        $doc->loadHTML($markup, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        $element = $doc->getElementsByTagName('*')->item(0);
        foreach ($attributes as $attributeName => $attributeValue) {
            $element->setAttribute($attributeName, $attributeValue);
        }

        return $doc->saveHTML() ?: '';
    }

    /**
     * Build an HTML attribute string from an associative array.
     *
     * Converts each array entry into `key="value"` pairs separated by single spaces.
     *
     * @param array<string,mixed> $attributes Associative map of attribute names to values.
     * @return string The attributes formatted as `key="value"` pairs separated by spaces.
     */
    protected static function concatAttributes(array $attributes): string
    {
        return implode(' ', array_map(static function ($key) use ($attributes) {
            return $key . '="' . $attributes[$key] . '"';
        }, array_keys($attributes)));
    }
}
