..  _introduction:

============
Introduction
============

Icon Picker adds a form element for icon selection to the TYPO3 backend. The
icons come from sources you configure in page TSconfig, so editors pick from
the same icons the frontend uses:

*   An **icon font**: link the stylesheet, for example Font Awesome,
    Bootstrap Icons or an Icomoon project. The extension reads the
    stylesheet and the font file and lists every glyph that has a CSS class.
*   A **folder of image files**, for example SVG icons in your site package.
    Subfolders become separate groups in the gallery.

..  figure:: /Images/backend1.jpg
    :alt: Icon field in a backend form
    :class: with-shadow

    The icon field in a content element

..  figure:: /Images/gallery.jpg
    :alt: Icon gallery with tabs, groups and filter
    :class: with-shadow

    The gallery with one tab per icon provider

..  _introduction-features:

Features
========

*   Form element ``iconSelection`` for your own TCA fields and for
    `Content Blocks <https://extensions.typo3.org/extension/content_blocks>`__
*   Optional icon field for ``tt_content``, ``pages`` and ``sys_category``
*   CKEditor plugin to insert icons into rich text
*   Gallery with tabs, groups and a filter
*   Icons from image files or from icon fonts (CSS)
*   Remote stylesheets: font files are downloaded and cached in
    :file:`typo3temp/`
*   Frontend include of the extracted icon stylesheets

..  tip::
    Link the stylesheet of your Icomoon project. The picker stays up to date
    with the project, and the font files are served from your own server
    without downloading them by hand.

..  _introduction-demo:

Demo
====

..  figure:: /Images/preview.gif
    :alt: Selecting an icon in the backend
    :class: with-shadow

..  figure:: /Images/RTE.jpg
    :alt: Icon Picker in the rich text editor
    :class: with-shadow

    Icons in the rich text editor
