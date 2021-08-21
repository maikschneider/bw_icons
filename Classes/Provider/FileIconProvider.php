<?php

namespace Blueways\BwIcons\Provider;

use TYPO3\CMS\Core\Utility\GeneralUtility;

class FileIconProvider extends AbstractIconProvider
{

    public $test = 'few';

    public function getIcons(): array
    {
        $icons = [];
        $path = GeneralUtility::getFileAbsFileName($this->options['folder']);
        $icons = array_merge($icons, GeneralUtility::getFilesInDir($path));
        $folders = GeneralUtility::get_dirs($path);

        foreach ($folders as $folder) {
            $folderIcons = GeneralUtility::getFilesInDir($path . '/' . $folder);
            $folderIcons = array_map(function ($icon) use ($folder) {
                return $folder . '/' . $icon;
            }, $folderIcons);
            $icons = array_merge($icons, $folderIcons);
        }

        $iconFiles = [];
        foreach ($icons as $icon) {
            $iconFiles[] = $this->options['folder'] . '/' . $icon;
        }

        return $iconFiles;
    }
}
