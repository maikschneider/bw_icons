<?php

namespace Blueways\BwIcons\Provider;

use TYPO3\CMS\Core\Utility\GeneralUtility;

class FileIconProvider extends AbstractIconProvider
{
    public function getIcons(): array
    {
        $icons = [];
        $path = GeneralUtility::getFileAbsFileName($this->options['folder']);
        $icons[] = GeneralUtility::getFilesInDir($path);
        $folders = GeneralUtility::get_dirs($path);

        foreach ($folders as $folder) {
            $folderIcons = GeneralUtility::getFilesInDir($path . '/' . $folder);
            $folderIcons = array_map(static function ($icon) use ($folder) {
                return $folder . '/' . $icon;
            }, $folderIcons);
            $icons[] = $folderIcons;
        }

        $icons = array_merge([], ...$icons);
        $iconFiles = [];
        foreach ($icons as $icon) {
            $iconFiles[] = $this->options['folder'] . '/' . $icon;
        }

        return $iconFiles;
    }
}
