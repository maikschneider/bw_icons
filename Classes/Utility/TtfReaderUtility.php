<?php

namespace Blueways\BwIcons\Utility;

use FontLib\Font;
use TYPO3\CMS\Core\Utility\ExtensionManagementUtility;

class TtfReaderUtility
{
    public function __construct()
    {
        if (!class_exists('\FontLib\Font')) {
            @include 'phar://' . ExtensionManagementUtility::extPath('bw_icons') . 'Libraries/phenx-php-font-lib.phar/vendor/autoload.php';
        }
    }

    public function getGlyphs($ttfFile): array
    {
        try {
            $font = Font::load($ttfFile);
            $font->parse();
            $chars = $font->getUnicodeCharMap();
            $cleanChars = array_map(function ($char) {
                return mb_chr($char, 'UTF-8');
            }, array_keys($chars));
        } catch (\Exception $e) {
            $cleanChars = [];
        }

        return $cleanChars;
    }
}
