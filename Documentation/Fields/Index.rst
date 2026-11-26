..  _fields:

======
Fields
======

Any TCA field of type ``input`` can become an icon field with the render type
``iconSelection``.

..  _fields-tca:

Icon field in your own table
============================

#.  Add a database column for the icon. Icon values are file paths or CSS
    classes, so ``varchar(255)`` is enough:

    ..  code-block:: sql
        :caption: EXT:my_extension/ext_tables.sql

        CREATE TABLE tx_myextension_domain_model_teaser (
            icon varchar(255) DEFAULT '' NOT NULL
        );

#.  Set the render type in the TCA of the field:

    ..  code-block:: php
        :caption: EXT:my_extension/Configuration/TCA/tx_myextension_domain_model_teaser.php

        'icon' => [
            'label' => 'Icon',
            'config' => [
                'type' => 'input',
                'renderType' => 'iconSelection',
            ],
        ],

#.  Update the database schema and flush all caches.

The gallery shows the icon providers of the page TSconfig of the record's
page, see :ref:`configuration-providers`.

..  _fields-options:

Options
=======

..  confval:: iconProviders
    :name: tca-iconProviders
    :type: string
    :default: (all providers)

    Comma-separated list of provider keys from ``mod.tx_bwicons`` to show in
    the gallery of this field. Without the option, all configured providers
    are shown.

    ..  code-block:: php

        'icon' => [
            'label' => 'Icon',
            'config' => [
                'type' => 'input',
                'renderType' => 'iconSelection',
                'iconProviders' => 'fontawesome,sitepackage',
            ],
        ],

Translated records
------------------

With ``'l10n_mode' => 'exclude'`` and ``'l10n_display' => 'defaultAsReadonly'``
the icon field of a translation shows the icon of the default language and
cannot be changed.

..  _fields-core-tables:

Core tables
===========

For ``tt_content``, ``pages`` and ``sys_category`` the extension brings the
field ``tx_bwicons_icon``. Enable it in the
:ref:`extension configuration <configuration-extension>` instead of adding
your own field.
