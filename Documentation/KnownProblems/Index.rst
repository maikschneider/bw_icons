..  _known-problems:

==============
Known problems
==============

..  _known-problems-woff:

Fonts without SVG or TTF file are not read
==========================================

The ``CssIconProvider`` reads the glyphs from the font file. It supports SVG
and TTF fonts only. If the ``@font-face`` rules of a stylesheet only
reference WOFF or WOFF2 files, the tab stays empty. Bootstrap Icons is an
example: its stylesheet ships ``.woff`` and ``.woff2`` files only
(`#45 <https://github.com/maikschneider/bw_icons/issues/45>`__).

Workaround: convert the font to TTF, for example with
`fontTools <https://github.com/fonttools/fonttools>`__
(``fonttools ttLib.woff2 decompress bootstrap-icons.woff2``), and use a
copy of the stylesheet that lists the TTF file in its ``@font-face``:

..  code-block:: css
    :caption: fileadmin/bootstrap-icons/font/bootstrap-icons.css

    @font-face {
        font-display: block;
        font-family: "bootstrap-icons";
        src: url("./fonts/bootstrap-icons.woff2") format("woff2"),
             url("./fonts/bootstrap-icons.woff") format("woff"),
             url("./fonts/bootstrap-icons.ttf") format("truetype");
    }

Icons need a CSS class
======================

Only glyphs that have a CSS class with ``content`` (or a CSS custom property)
and exist in the font file are listed. Glyphs only reachable through
ligatures or other selectors do not show up.

Changes to a stylesheet are not picked up
=========================================

The gallery is cached, and font files that already exist in
:file:`typo3temp/assets/tx_bwicons/` are not downloaded again. After an
icon font or a remote stylesheet changed, flush all caches and delete
:file:`typo3temp/assets/tx_bwicons/`.

Only one level of subfolders
============================

The ``FileIconProvider`` lists the files of the configured folder and of its
direct subfolders. Files in deeper subfolders are ignored.

Rich text editor ignores the markup option
==========================================

The CKEditor plugin inserts font icons as ``<i class="…"></i>``, even if the
provider configures :confval:`css-markup`, and it shows all providers of the
page.
