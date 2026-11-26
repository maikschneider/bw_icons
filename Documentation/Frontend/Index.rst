..  _frontend:

========
Frontend
========

The icon field stores either a file path (from a ``FileIconProvider``) or
CSS classes (from a ``CssIconProvider``).

..  _frontend-viewhelper:

Icon view helper
================

The view helper renders both kinds of values. A value with a dot is treated
as a file and rendered as ``<img>``, anything else as font icon:

..  code-block:: html

    <html xmlns:bw="http://typo3.org/ns/Blueways/BwIcons/ViewHelpers"
          data-namespace-typo3-fluid="true">

    <bw:icon icon="{data.tx_bwicons_icon}" /> Hello world!

    </html>

Output for a font icon:

..  code-block:: html

    <i class="fas fa-arrow-right" data-icon-name="fas fa-arrow-right"
       data-icon-base-name="fas fa-arrow-right"></i> Hello world!

Output for an image file:

..  code-block:: html

    <img data-icon-name="EXT:my_sitepackage/Resources/Public/Icons/right.svg"
         data-icon-base-name="right"
         src="/_assets/…/Icons/right.svg" loading="lazy" alt=""
         role="presentation" /> Hello world!

..  confval:: icon
    :name: viewhelper-icon
    :type: string
    :required: true

    The stored icon value.

..  confval:: markup
    :name: viewhelper-markup
    :type: string
    :default: <i class="###ICON###"></i>

    Markup for font icons. ``###ICON###`` is replaced with the CSS classes.
    Not used for image files.

    ..  code-block:: html

        <bw:icon icon="{data.tx_bwicons_icon}"
                 markup="<span class='my-icon ###ICON###'></span>" />

..  confval:: additionalAttributes
    :name: viewhelper-additionalAttributes
    :type: array

    Additional attributes for the tag. Each key is prefixed with ``data-``,
    so ``{color: 'red'}`` becomes ``data-color="red"``.

Without the view helper
-----------------------

If a field only offers image files, use the core view helper:

..  code-block:: html

    <f:image src="{data.tx_bwicons_icon}" />

If it only offers font icons, output the classes:

..  code-block:: html

    <i class="{data.tx_bwicons_icon}"></i>

..  _frontend-stylesheets:

Icon stylesheets
================

Font icons need their stylesheet in the frontend. Either include the
original stylesheet yourself, or let the extension add the stylesheets it
generated from the ``CssIconProvider`` configuration of the current page.
Add this to your TypoScript setup:

..  code-block:: typoscript
    :caption: EXT:my_sitepackage/Configuration/TypoScript/setup.typoscript

    page.headerData.123 = USER
    page.headerData.123 {
        userFunc = Blueways\BwIcons\Utility\CssUtility->includeStyleSheets
    }

This adds one ``<link rel="stylesheet">`` per ``CssIconProvider``. The
stylesheets point to the files in :file:`typo3temp/assets/tx_bwicons/`, which
contain the font faces and glyph rules found in the original stylesheet, with
font files served from your own server.
