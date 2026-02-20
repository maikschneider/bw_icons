<?php

namespace Blueways\BwIcons\Provider;

use Blueways\BwIcons\Domain\Model\Dto\WizardFolder;
use Blueways\BwIcons\Domain\Model\Dto\WizardIcon;
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
        $folders = self::getDirectories($path);

        // icons in root dir
        $icons[] = self::getFiles($path, $fileExtensionList);
        $icons[0] = array_map(static function ($icon) use ($typo3Path) {
            $typo3Path = str_starts_with((string)$typo3Path, '/') ? $typo3Path : '/' . $typo3Path;
            return $typo3Path . '/' . $icon;
        }, $icons[0]);
        $icons[0] = array_values($icons[0]);

        // icons in sub dirs
        foreach ($folders as $folder) {
            $folderIcons = self::getFiles($path . '/' . $folder, $fileExtensionList);
            $folderIcons = array_map(static function ($icon) use ($folder, $typo3Path) {
                $extPath = $typo3Path . '/' . $folder . '/' . $icon;
                return PathUtility::getPublicResourceWebPath($extPath);
            }, $folderIcons);
            $folderIcons = array_values($folderIcons);
            $icons[ucfirst($folder)] = $folderIcons;
        }

        return $icons;
    }

    public function getWizardFolders(): array
    {
        $wizardFolders = [];
        $typo3Path = $this->options['folder'];
        $fileExtensionList = $this->options['fileExtensionList'] ?? '';
        $path = GeneralUtility::getFileAbsFileName($typo3Path);
        $folders = self::getDirectories($path);

        $folderIcons = self::getFiles($path, $fileExtensionList);
        if (!empty($folderIcons)) {
            $wIcons = array_map(static function ($icon) use ($typo3Path) {
                $value = $typo3Path . '/' . $icon;
                return new WizardIcon($value);
            }, $folderIcons);

            $wFolder = new WizardFolder();
            $wFolder->icons = $wIcons;

            $wizardFolders[] = $wFolder;
        }

        // icons in sub dirs
        foreach ($folders as $folder) {
            $folderIcons = self::getFiles($path . '/' . $folder, $fileExtensionList);
            if (empty($folderIcons)) {
                continue;
            }

            $wIcons = array_map(static function ($icon) use ($folder, $typo3Path) {
                $value = $typo3Path . '/' . $folder . '/' . $icon;
                return new WizardIcon($value);
            }, $folderIcons);

            $wFolder = new WizardFolder();
            $wFolder->title = ucfirst($folder);
            $wFolder->icons = $wIcons;

            $wizardFolders[] = $wFolder;
        }

        return $wizardFolders;
    }

    /**
     * @return string[]
     */
    protected static function getDirectories(string $path): array
    {
        if (!is_dir($path)) {
            return [];
        }

        return array_values(array_filter(
            scandir($path) ?: [],
            static fn(string $item): bool => $item !== '.' && $item !== '..' && is_dir($path . '/' . $item)
        ));
    }

    /**
     * @return string[]
     */
    protected static function getFiles(string $path, string $fileExtensionList = ''): array
    {
        if (!is_dir($path)) {
            return [];
        }

        $extensions = GeneralUtility::trimExplode(',', $fileExtensionList, true);

        return array_values(array_filter(
            scandir($path) ?: [],
            static fn(string $item): bool => is_file($path . '/' . $item)
                && ($extensions === [] || in_array(pathinfo($item, PATHINFO_EXTENSION), $extensions, true))
        ));
    }
}
