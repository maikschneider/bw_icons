<?php

namespace Blueways\BwIcons\Utility;

class TtfReaderUtility
{

    public function getGlyphs($ttfFile): array
    {
        $ttfCopy = 'font.ttf';

        if (file_exists($ttfCopy)) {
            unlink($ttfCopy);
        }
        copy($ttfFile, $ttfCopy);

        try {
            $font = \FontLib\Font::load($ttfCopy);
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
