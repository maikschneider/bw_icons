..  _installation:

============
Installation
============

..  _installation-requirements:

Requirements
============

*   TYPO3 13.4.21 or later, or TYPO3 14.3 LTS
*   PHP 8.2 to 8.5

TYPO3 12 is supported by version 4 of the extension.

..  _installation-composer:

Composer mode
=============

Install the extension via Composer:

..  code-block:: bash

    composer require blueways/bw-icons

Then update the database schema:

..  code-block:: bash

    vendor/bin/typo3 extension:setup

..  _installation-classic:

Classic mode
============

Download the extension from the
`TYPO3 Extension Repository <https://extensions.typo3.org/extension/bw_icons>`__
or install it in :guilabel:`Admin Tools > Extensions`. Activate it and run
:guilabel:`Admin Tools > Maintenance > Analyze Database Structure`.

..  _installation-next-steps:

Next steps
==========

#.  Configure at least one icon provider in page TSconfig, or include the
    page TSconfig with the TYPO3 core icons, see :ref:`configuration`.
#.  Enable the icon field for ``tt_content``, ``pages`` or ``sys_category``
    in the :ref:`extension configuration <configuration-extension>`, or add
    an icon field to your own table, see :ref:`fields`.
#.  Optional: add the :ref:`Icon Picker button to CKEditor <rte>`.
#.  Optional: :ref:`include the icon stylesheets in the frontend
    <frontend-stylesheets>`.
