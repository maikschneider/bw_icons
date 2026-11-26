..  _content-blocks:

==============
Content Blocks
==============

`Content Blocks <https://docs.typo3.org/p/friendsoftypo3/content-blocks/main/en-us/>`__
passes ``renderType`` of a field to its TCA. A field of type ``Text`` creates
an ``input`` field, so ``renderType: iconSelection`` turns it into an icon
field:

..  code-block:: yaml
    :caption: EXT:my_sitepackage/ContentBlocks/ContentElements/teaser/config.yaml

    name: my-vendor/teaser
    fields:
      - identifier: header
        useExistingField: true
      - identifier: icon
        type: Text
        renderType: iconSelection

Content Blocks creates the database column. Render the icon in the frontend
template with the :ref:`icon view helper <frontend-viewhelper>`:

..  code-block:: html
    :caption: EXT:my_sitepackage/ContentBlocks/ContentElements/teaser/templates/frontend.html

    <html xmlns:bw="http://typo3.org/ns/Blueways/BwIcons/ViewHelpers"
          data-namespace-typo3-fluid="true">

    <bw:icon icon="{data.icon}" />
    <h2>{data.header}</h2>

    </html>

..  note::
    The ``Text`` field type of Content Blocks only passes the options it
    knows to TCA. :confval:`tca-iconProviders` is not one of them, so a
    Content Blocks icon field always shows all configured providers.
