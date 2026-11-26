..  _start:

===========
Icon Picker
===========

:Extension key:
    bw_icons

:Package name:
    blueways/bw-icons

:Version:
    |release|

:Language:
    en

:Author:
    Maik Schneider & Contributors

:License:
    This document is published under the
    `Open Publication License <https://www.opencontent.org/openpub/>`__.

:Rendered:
    |today|

----

Icon Picker adds an icon selection to FormEngine and CKEditor. It builds a
browsable gallery from the icon fonts and image folders you already use in
the frontend: link a stylesheet like Font Awesome or Icomoon, or point to a
directory of SVG files.

----

..  card-grid::
    :columns: 1
    :columns-md: 2
    :gap: 4
    :class: pb-4
    :card-height: 100

    ..  card:: :ref:`Introduction <introduction>`

        What the extension does, with screenshots.

    ..  card:: :ref:`Installation <installation>`

        Requirements, Composer and classic mode.

    ..  card:: :ref:`Configuration <configuration>`

        Icon providers in page TSconfig and the extension configuration.

    ..  card:: :ref:`Fields <fields>`

        The ``iconSelection`` render type in your own TCA.

    ..  card:: :ref:`Content Blocks <content-blocks>`

        An icon field in a Content Blocks ``config.yaml``.

    ..  card:: :ref:`Rich text editor <rte>`

        The Icon Picker button in CKEditor.

    ..  card:: :ref:`Frontend <frontend>`

        Rendering the selected icon and including the icon stylesheets.

    ..  card:: :ref:`Developer <developer>`

        Custom icon providers and the ``IconService``.

    ..  card:: :ref:`Known problems <known-problems>`

        Fonts that cannot be read and other limitations.

    ..  card:: :ref:`Upgrade <upgrade>`

        Breaking changes in version 5.0.

..  Table of Contents

..  toctree::
    :maxdepth: 2
    :titlesonly:
    :hidden:

    Introduction/Index
    Installation/Index
    Configuration/Index
    Fields/Index
    ContentBlocks/Index
    Rte/Index
    Frontend/Index
    Developer/Index
    KnownProblems/Index
    Upgrade/Index
