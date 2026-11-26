..  _developer:

=========
Developer
=========

..  _developer-custom-provider:

Custom icon providers
=====================

To load icons from another source, for example an API, write your own
provider. Extend ``Blueways\BwIcons\Provider\AbstractIconProvider`` and
implement ``getIcons()`` and ``getWizardFolders()``:

..  code-block:: php
    :caption: EXT:my_extension/Classes/IconProvider/ApiIconProvider.php

    <?php

    namespace MyVendor\MyExtension\IconProvider;

    use Blueways\BwIcons\Domain\Model\Dto\WizardFolder;
    use Blueways\BwIcons\Domain\Model\Dto\WizardIcon;
    use Blueways\BwIcons\Provider\AbstractIconProvider;

    final class ApiIconProvider extends AbstractIconProvider
    {
        public function getIcons(): array
        {
            return [
                'fileadmin/api-icons/star.svg',
                'fileadmin/api-icons/heart.svg',
            ];
        }

        /**
         * @return WizardFolder[]
         */
        public function getWizardFolders(): array
        {
            $folder = new WizardFolder();
            $folder->title = 'API';
            $folder->icons = array_map(
                static fn(string $value): WizardIcon => new WizardIcon($value),
                $this->getIcons()
            );

            return [$folder];
        }
    }

Register it like the shipped providers:

..  code-block:: typoscript

    mod.tx_bwicons {
        api = MyVendor\MyExtension\IconProvider\ApiIconProvider
        api {
            title = API icons
            endpoint = https://example.com/icons.json
        }
    }

Every option of the provider is available in ``$this->options``.

The gallery is built from ``getWizardFolders()``. ``WizardIcon`` takes the
value to store and whether it is a font icon
(``new WizardIcon('fa fa-star', true)``). Image values need to be an ``EXT:``
path or a path below :file:`fileadmin/`, otherwise the gallery cannot show a
preview. Return a stylesheet URL from ``getStyleSheet()`` if your font icons
need one in the backend.

..  important::
    Providers are created by ``Blueways\BwIcons\Factory\IconProviderFactory``
    with ``new $className($options)``. They are not fetched from the
    dependency injection container, so the constructor receives the options
    array as its only argument.

..  _developer-icon-service:

IconService
===========

``Blueways\BwIcons\Service\IconService`` resolves the providers of a page and
caches the gallery data. Inject it where you need the configured icons:

..  code-block:: php

    use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
    use Blueways\BwIcons\Service\IconService;

    final class MyService
    {
        public function __construct(private readonly IconService $iconService) {}

        public function getIconStylesheets(int $pageId): array
        {
            $config = new WizardConfig();
            $config->pid = $pageId;

            return $this->iconService->getStyleSheets($config);
        }
    }

``getWizardTabs()`` returns the tabs, groups and icons of the gallery,
``getPageTsSettings()`` the plain ``mod.tx_bwicons`` configuration of a page.
To limit the providers, set ``$config->iconProviders`` to a list of provider
keys.
