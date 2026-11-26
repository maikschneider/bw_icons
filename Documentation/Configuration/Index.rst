..  _configuration:

=============
Configuration
=============

..  _configuration-providers:

Icon providers
==============

Icon providers are configured in page TSconfig below ``mod.tx_bwicons``.
Each provider is one tab in the icon gallery. Choose a unique key, assign the
provider class and set its options:

..  code-block:: typoscript
    :caption: EXT:my_sitepackage/Configuration/page.tsconfig

    mod.tx_bwicons {
        # Icons from a folder. Subfolders become groups in the gallery.
        sitepackage = Blueways\BwIcons\Provider\FileIconProvider
        sitepackage {
            title = Site icons
            folder = EXT:my_sitepackage/Resources/Public/Icons
            fileExtensionList = svg
        }

        # Icons from a stylesheet. Every font face becomes a group.
        fontawesome = Blueways\BwIcons\Provider\CssIconProvider
        fontawesome {
            title = Font Awesome
            file = fileadmin/fontawesome/css/all.css
        }

        # Icons from a remote stylesheet. Styles and font files are cached
        # in typo3temp/assets/tx_bwicons/.
        icomoon = Blueways\BwIcons\Provider\CssIconProvider
        icomoon {
            title = Icomoon
            file = https://i.icomoon.io/public/b23ec64zea/Project/style.css
            markup = <span class="my-icon ###ICON###"></span>
        }
    }

The key (``sitepackage``, ``fontawesome``, ``icomoon``) identifies the
provider, for example in the :confval:`tca-iconProviders` option of a field.
Since the configuration is page TSconfig, different page trees can offer
different icons. Flush all caches after changing it.

..  _configuration-core-icons:

TYPO3 core icons
----------------

The extension ships page TSconfig with a ``FileIconProvider`` for the SVG
icons of the TYPO3 core. Include it in the page properties of your root
page: :guilabel:`Resources > Page TSconfig > Include static Page TSconfig`,
item :guilabel:`Icon Picker: TYPO3 Core Icons (bw_icons)`.

..  _configuration-file-icon-provider:

FileIconProvider
----------------

``Blueways\BwIcons\Provider\FileIconProvider`` lists the image files of a
folder. Files directly in the folder form the first group, each subfolder
becomes a group named after it. Deeper subfolders are ignored.

The field stores the path of the selected file, with the configured
``folder`` as prefix, for example
``EXT:my_sitepackage/Resources/Public/Icons/arrows/right.svg``.

..  confval:: title
    :name: file-title
    :type: string
    :required: true

    Label of the tab in the gallery.

..  confval:: folder
    :name: file-folder
    :type: string
    :required: true

    Folder with the icon files, either as ``EXT:`` path or as path below
    :file:`fileadmin/`, for example ``fileadmin/icons``. The gallery shows
    previews only for these two kinds of paths.

..  confval:: fileExtensionList
    :name: file-fileExtensionList
    :type: string
    :default: (all files)

    Comma-separated list of file extensions to include, for example
    ``svg`` or ``svg,png``. The comparison is case-insensitive. When empty,
    every file of the folder is listed.

..  _configuration-css-icon-provider:

CssIconProvider
---------------

``Blueways\BwIcons\Provider\CssIconProvider`` reads a stylesheet with
``@font-face`` rules and glyph classes such as
``.fa-arrow-right:before { content: "\f061"; }``. Every glyph that exists
in the font file and has a CSS class becomes an icon; every font face that
is used by a rule becomes a group.

The extension downloads the referenced font files and writes a reduced
stylesheet with the font faces and glyph rules to
:file:`typo3temp/assets/tx_bwicons/`. The backend and the
:ref:`frontend include <frontend-stylesheets>` use this copy.

The field stores the CSS classes of the selected icon, including a prefix
class of the font if the stylesheet defines one, for example
``fas fa-arrow-right``.

..  note::
    The font face must reference an SVG or TTF font file. Fonts that only
    ship WOFF or WOFF2 files cannot be read, see
    :ref:`known-problems-woff`.

..  confval:: title
    :name: css-title
    :type: string
    :required: true

    Label of the tab in the gallery.

..  confval:: file
    :name: css-file
    :type: string
    :required: true

    The stylesheet: an ``EXT:`` path, a path below :file:`fileadmin/` such
    as ``fileadmin/fontawesome/css/all.css``, or a URL.
    Relative font URLs in the stylesheet are resolved against its location.

..  confval:: markup
    :name: css-markup
    :type: string
    :default: <i class="###ICON###"></i>

    HTML used to display the icons of this provider in the backend. The
    placeholder ``###ICON###`` is replaced with the CSS classes of the icon.
    Use it if the font needs a different element or additional classes. For
    the frontend, pass the same markup to the
    :ref:`icon view helper <frontend-viewhelper>`.

..  _configuration-extension:

Extension configuration
=======================

The extension can add a field ``tx_bwicons_icon`` to three core tables.
The database columns always exist; these settings only add the field to the
backend forms. Enable them in
:guilabel:`Admin Tools > Settings > Extension Configuration > bw_icons`.

..  confval:: tt_content
    :name: extconf-tt_content
    :type: boolean
    :default: false

    Adds the icon field to content elements, in the header palette.

..  confval:: pages
    :name: extconf-pages
    :type: boolean
    :default: false

    Adds the icon field to page properties, next to the page title.

..  confval:: sys_category
    :name: extconf-sys_category
    :type: boolean
    :default: false

    Adds the icon field to categories, after the title.
