<?php

namespace Blueways\BwIcons\Utility;

class SvgReaderUtility
{
    public function getGlyphs($svgFile): array
    {
        $svgContent = file_get_contents($svgFile);

        $xmlInit = simplexml_load_string($svgContent);
        $svgJson = json_encode($xmlInit);
        $svgArray = json_decode($svgJson, true);

        $svgGlyphs = $svgArray['defs']['font']['glyph'];
        $svgGlyphsClear = [];

        if (count($svgGlyphs) > 0) {
            foreach ($svgGlyphs as $glyphId => $glyph) {
                if (isset($glyph['@attributes']['unicode'])) {
                    $svgGlyphsClear[$glyphId] = $glyph['@attributes']['unicode'];
                }
            }
        }

        return $svgGlyphsClear;
    }
}
