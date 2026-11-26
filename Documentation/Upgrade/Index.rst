..  _upgrade:

=======
Upgrade
=======

..  _upgrade-5-0:

Upgrade to 5.0
==============

Version 5.0 adds support for TYPO3 14 and moves the internals to dependency
injection. Integrators who only use page TSconfig, TCA, the view helper in
Fluid and the TypoScript include need to change nothing besides the TYPO3
version. Code that uses the PHP classes of the extension needs the changes
below.

TYPO3 12 support dropped
------------------------

Version 5 requires TYPO3 13.4.21 or 14.3, and PHP 8.2 or newer. Stay on version
4 for TYPO3 12.

HelperUtility replaced by IconService
-------------------------------------

``Blueways\BwIcons\Utility\HelperUtility`` has been removed. Its successor
``Blueways\BwIcons\Service\IconService`` is a service: inject it instead of
creating it with ``GeneralUtility::makeInstance()``. The configuration moves
from the constructor to the method arguments:

..  code-block:: php

    // Before
    $helperUtility = GeneralUtility::makeInstance(
        HelperUtility::class,
        new WizardConfig($pid, 'fontawesome')
    );
    $sheets = $helperUtility->getStyleSheets();

    // After
    $config = new WizardConfig();
    $config->pid = $pid;
    $config->iconProviders = ['fontawesome'];
    $sheets = $this->iconService->getStyleSheets($config);

``getWizardTabs()``, ``getStyleSheets()`` and ``getMarkupForIconValue()``
take the ``WizardConfig`` as argument. See :ref:`developer-icon-service`.

WizardConfig changed
--------------------

``Blueways\BwIcons\Domain\Model\Dto\WizardConfig`` has no constructor
arguments anymore:

*   ``$iconProvidersString`` and ``$iconProviderClasses`` are replaced by
    ``$iconProviders``, an array of provider keys.
*   ``$typo3Version`` has been removed.
*   ``getPageTsSettings()`` and ``getCacheIdentifier()`` moved to
    ``IconService`` and take the page ID or the ``WizardConfig``.
*   New factory ``WizardConfig::createFromFrontendRequest()`` reads the page
    ID from the ``frontend.page.information`` request attribute.

Icon providers created by a factory
-----------------------------------

Providers are created by ``Blueways\BwIcons\Factory\IconProviderFactory``
instead of ``GeneralUtility::makeInstance()``. Custom providers keep working
if their constructor accepts the options array as only argument, see
:ref:`developer-custom-provider`.

The constructor of ``CssIconProvider`` now requires the
``SvgReaderUtility`` and ``TtfReaderUtility`` in addition to the options. The
factory passes them to subclasses of ``CssIconProvider`` as well.

IconViewHelper::renderStatic() removed
--------------------------------------

``Blueways\BwIcons\ViewHelpers\IconViewHelper`` uses ``render()`` instead of
the static ``renderStatic()``. Fluid templates are not affected. PHP code
that called ``IconViewHelper::renderStatic()`` directly has to render the
view helper through Fluid.

CssUtility uses dependency injection
------------------------------------

``Blueways\BwIcons\Utility\CssUtility`` gets the ``IconService`` injected.
The TypoScript include stays the same, see
:ref:`frontend-stylesheets`. PHP code that instantiates ``CssUtility``
needs to get it from the container.
