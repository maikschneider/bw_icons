..  _rte:

================
Rich text editor
================

The extension ships a CKEditor plugin with a toolbar button that opens the
icon gallery. Selected icons are inserted inline: image icons as ``<img>``,
font icons as ``<i class="…"></i>``.

Import the plugin configuration into your RTE preset and add the button
``IconPicker`` to the toolbar:

..  code-block:: yaml
    :caption: EXT:my_sitepackage/Configuration/RTE/Default.yaml

    imports:
      - { resource: 'EXT:rte_ckeditor/Configuration/RTE/Default.yaml' }
      - { resource: 'EXT:bw_icons/Configuration/RTE/IconPicker.yaml' }

    editor:
      config:
        toolbar:
          items:
            - IconPicker

The imported file loads the CKEditor module and a stylesheet for the editor
content. See the
`CKEditor documentation <https://docs.typo3.org/c/typo3/cms-rte-ckeditor/main/en-us/Configuration/Index.html>`__
for how to register and select an RTE preset.

The gallery in the editor shows all providers of the page TSconfig of the
current page. Font icons are always inserted as ``<i>``, regardless of the
:confval:`css-markup` option.

..  figure:: /Images/RTE.jpg
    :alt: Icon Picker in the rich text editor
    :class: with-shadow

To show font icons in the frontend, :ref:`include the icon stylesheets
<frontend-stylesheets>`.
