<?php

namespace Blueways\BwIcons\Provider;

use TYPO3\CMS\Core\Utility\GeneralUtility;

class FileIconProvider extends AbstractIconProvider
{

    public function getIcons(): array
    {
        $icons = [];
        $typo3Path = $this->options['folder'];
        $path = GeneralUtility::getFileAbsFileName($typo3Path);
        $icons[] = GeneralUtility::getFilesInDir($path);
        $folders = GeneralUtility::get_dirs($path);


        foreach ($folders as $folder) {
            $folderIcons = GeneralUtility::getFilesInDir($path . '/' . $folder);
            $folderIcons = array_map(static function ($icon) use ($folder, $typo3Path) {
                return $typo3Path . '/' . $folder . '/' . $icon;
            }, $folderIcons);
            $icons[ucfirst($folder)] = $folderIcons;
        }

        return $icons;
    }
}
