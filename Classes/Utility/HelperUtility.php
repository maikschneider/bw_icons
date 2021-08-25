<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;

class HelperUtility
{

    protected int $pid = 0;

    /**
     * HelperUtility constructor.
     *
     * @param int $pid
     */
    public function __construct(int $pid)
    {
        $this->pid = $pid;
    }

    public function getModalTabs(): array
    {
        $extensionSettings = $this->getSettings();
        $cacheIdentifier = md5(serialize($extensionSettings));
        $cache = GeneralUtility::makeInstance(\TYPO3\CMS\Core\Cache\CacheManager::class)->getCache('bwicons_conf');

        if (($tabs = $cache->get($cacheIdentifier)) === false) {

            $tabs = [];
            foreach ($extensionSettings as $key => $providerSettings) {
                $options = $providerSettings;
                $options['cacheIdentifier'] = $cacheIdentifier;
                $options['id'] = $key;
                unset($options['_typoScriptNodeValue']);
                $provider = GeneralUtility::makeInstance($providerSettings['_typoScriptNodeValue'], $options);
                $tab = [];
                $tab['id'] = $key;
                $tab['title'] = $providerSettings['title'];
                $tab['folders'] = $provider->getIcons();
                $tabs[] = $tab;
            }
            $cache->set($cacheIdentifier, $tabs, [], 0);
        }
        return $tabs;
    }

    protected function getSettings(): array
    {
        $pageTsConfig = BackendUtility::getPagesTSconfig($this->pid);
        /** @var TypoScriptService $typoscriptService */
        $typoscriptService = GeneralUtility::makeInstance(TypoScriptService::class);
        return $typoscriptService->convertTypoScriptArrayToPlainArray($pageTsConfig['mod.']['tx_bwicons.'] ?? []);
    }

    public function getStyleSheets(): array
    {
        $sheets = [];
        $settings = $this->getSettings();
        foreach ($settings as $setting) {
            if ($setting['_typoScriptNodeValue'] !== CssIconProvider::class) {
                continue;
            }

            $path = GeneralUtility::getFileAbsFileName($setting['file']);
            $sheets[] = '/' . substr(PathUtility::getRelativePath(Environment::getPublicPath(), $path), 0, -1);
        }
        return $sheets;
    }
}
