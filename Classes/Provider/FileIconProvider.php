<?php

namespace Blueways\BwIcons\Provider;

use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Resource\Exception\ResourceDoesNotExistException;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\PathUtility;

class FileIconProvider extends AbstractIconProvider
{
    public function getIcons(): array
    {
        $icons = [];
        $typo3Path = $this->options['folder'];
        $fileExtensionList = $this->options['fileExtensionList'] ?? '';
        $path = GeneralUtility::getFileAbsFileName($typo3Path);
        $folders = GeneralUtility::get_dirs($path);

        // icons in root dir
        $icons[] = GeneralUtility::getFilesInDir($path, $fileExtensionList);
        $icons[0] = array_map(static function ($icon) use ($typo3Path) {
            $typo3Path = str_starts_with($typo3Path, '/') ? $typo3Path : '/' . $typo3Path;
            return $typo3Path . '/' . $icon;
        }, $icons[0]);
        $icons[0] = array_values($icons[0]);

        // icons in sub dirs
        foreach ($folders as $folder) {
            $folderIcons = GeneralUtility::getFilesInDir($path . '/' . $folder, $fileExtensionList);
            $folderIcons = array_map(static function ($icon) use ($folder, $typo3Path) {
                $extPath = $typo3Path . '/' . $folder . '/' . $icon;
                return PathUtility::getPublicResourceWebPath($extPath);
            }, $folderIcons);
            $folderIcons = array_values($folderIcons);
            $icons[ucfirst($folder)] = $folderIcons;
        }

        return $icons;
    }
}
