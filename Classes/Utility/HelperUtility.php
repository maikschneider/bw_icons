<?php

namespace Blueways\BwIcons\Utility;

use Blueways\BwIcons\Provider\CssIconProvider;
use TYPO3\CMS\Backend\Utility\BackendUtility;
use TYPO3\CMS\Core\TypoScript\TypoScriptService;
use TYPO3\CMS\Core\Utility\GeneralUtility;

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

            // do add ../ to path if include from extension
            if (strpos($setting['file'], 'EXT:') === 0) {
                $sheets[] = $setting['file'];
                continue;
            }

            $sheets[] = '../' . $setting['file'];
        }
        return $sheets;
    }
}
