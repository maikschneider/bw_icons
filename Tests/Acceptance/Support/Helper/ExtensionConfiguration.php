<?php

namespace Blueways\BwIconsTest\Acceptance\Support\Helper;

use Blueways\BwIconsTest\Acceptance\Support\AcceptanceTester;
use TYPO3\CMS\Core\Configuration\ConfigurationManager;
use TYPO3\CMS\Core\Utility\GeneralUtility;

class ExtensionConfiguration
{
    private readonly ConfigurationManager $configurationManager;

    public function __construct(private readonly AcceptanceTester $tester)
    {
        $this->configurationManager = GeneralUtility::makeInstance(ConfigurationManager::class);
    }

    public function read(string $path): mixed
    {
        return $this->configurationManager->getConfigurationValueByPath('EXTENSIONS/bw_icons/' . $path);
    }

    /**
     * @param non-empty-string $path
     */
    public function write(string $path, mixed $value): void
    {
        $this->configurationManager->setLocalConfigurationValueByPath('EXTENSIONS/bw_icons/' . $path, $value);

        $I = $this->tester;
        $I->runShellCommand('typo3 cache:flush');
    }
}
