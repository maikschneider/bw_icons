<?php

namespace Blueways\BwIcons\Form\Element;

use Blueways\BwIcons\Utility\HelperUtility;
use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Page\JavaScriptModuleInstruction;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\MathUtility;
use TYPO3\CMS\Core\Utility\StringUtility;
use TYPO3\CMS\Fluid\View\StandaloneView;

class IconSelection extends AbstractFormElement
{
    public function render(): array
    {
        $resultArray = $this->initializeResultArray();
        $fieldId = StringUtility::getUniqueId('formengine-input-');

        $fieldWizardResult = $this->renderFieldWizard();
        $resultArray = $this->mergeChildReturnIntoExistingResult($resultArray, $fieldWizardResult, false);
        $parameterArray = $this->data['parameterArray'];
        $pid = $this->data['tableName'] === 'pages' ? $this->data['vanillaUid'] : $this->data['databaseRow']['pid'];
        $pid = MathUtility::canBeInterpretedAsInteger($pid) ? (int)$pid : 0;
        $config = $parameterArray['fieldConf']['config'];
        $iconProviders = $config['iconProviders'] ?? '';

        $helperUtil = GeneralUtility::makeInstance(HelperUtility::class, $pid, $iconProviders);
        $styleSheets = $helperUtil->getStyleSheets();
        $styleSheetPaths = array_map(static function ($styleSheet) {
            return Environment::getPublicPath() . $styleSheet;
        }, $styleSheets);
        $resultArray['stylesheetFiles'] = $styleSheetPaths;
        $resultArray['javaScriptModules'][] = JavaScriptModuleInstruction::create('@blueways/bw-icons/IconElement.js');
        $resultArray['additionalInlineLanguageLabelFiles'][] = 'EXT:bw_icons/Resources/Private/Language/locallang.xlf';

        $defaultInputWidth = 10;
        $size = MathUtility::forceIntegerInRange(
            $config['size'] ?? $defaultInputWidth,
            $this->minimumInputWidth,
            $this->maxInputWidth
        );
        $width = $this->formMaxWidth($size);

        $templateView = GeneralUtility::makeInstance(StandaloneView::class);
        $templateView->setTemplatePathAndFilename('EXT:bw_icons/Resources/Private/Template/FormElement.html');
        $templateView->assignMultiple([
            'itemFormElName' => $parameterArray['itemFormElName'],
            'itemFormElValue' => $parameterArray['itemFormElValue'],
            'width' => $width,
        ]);

        $resultArray['labelHasBeenHandled'] = true;
        $html = $this->renderLabel($fieldId);
        $html .= '<bw-icon-element></bw-icon-element>';

        $resultArray['html'] = $html;
        return $resultArray;
    }
}
