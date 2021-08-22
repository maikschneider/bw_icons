<?php

namespace Blueways\BwIcons\Utility;

class SvgReaderUtility
{

    public function getGlyphs($svgFile)
    {
        $svgCopy = 'font.svg';

        if (file_exists($svgCopy)) {
            unlink($svgCopy);
        }
        copy($svgFile, $svgCopy);

        $svgContent = file_get_contents($svgCopy);

        $xmlInit = simplexml_load_string($svgContent);
        $svgJson = json_encode($xmlInit);
        $svgArray = json_decode($svgJson, true);

        $svgGlyphs = $svgArray['defs']['font']['glyph'];

        if (count($svgGlyphs) > 0) {
            $svgGlyphsClear = array();

            foreach ($svgGlyphs as $glyphId => $glyph) {
                if (isset($glyph['@attributes']['unicode'])) {
                    $svgGlyphsClear[$glyphId] = $glyph['@attributes']['unicode'];
                }
            }
        }

        return $svgGlyphsClear;
    }

}
