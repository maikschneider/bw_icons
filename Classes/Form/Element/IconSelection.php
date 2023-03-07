<?php

namespace Blueways\BwIcons\Form\Element;

use Blueways\BwIcons\Utility\HelperUtility;
use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\MathUtility;
use TYPO3\CMS\Core\Utility\VersionNumberUtility;
use TYPO3\CMS\Fluid\View\StandaloneView;

class IconSelection extends AbstractFormElement
{

    public function render()
    {
        $resultArray = $this->initializeResultArray();

        $fieldWizardResult = $this->renderFieldWizard();
        $fieldWizardHtml = $fieldWizardResult['html'];
        $resultArray = $this->mergeChildReturnIntoExistingResult($resultArray, $fieldWizardResult, false);
        $parameterArray = $this->data['parameterArray'];
        $pid = $this->data['tableName'] === 'pages' ? $this->data['vanillaUid'] : $this->data['databaseRow']['pid'];
        $config = $parameterArray['fieldConf']['config'];
        $iconProviders = $config['iconProviders'] ?? '';

        $helperUtil = GeneralUtility::makeInstance(HelperUtility::class, $pid, $iconProviders);
        $styleSheets = $helperUtil->getStyleSheets();
        $resultArray['stylesheetFiles'] = $styleSheets;

        $verionNumberUtility = GeneralUtility::makeInstance(VersionNumberUtility::class);
        $version = $verionNumberUtility->convertVersionStringToArray($verionNumberUtility->getNumericTypo3Version());
        if ($version['version_main'] < 12) {
            $resultArray['requireJsModules'][] = ['TYPO3/CMS/BwIcons/IconSelection' => 'function(IconSelection){top.require([], function() { const iconPicker = new IconSelection(' . $pid . '); iconPicker.initForFormElement("' . $parameterArray['itemFormElName'] . '"); }); }'];
        } else {
            $resultArray['javaScriptModules'][] = \TYPO3\CMS\Core\Page\JavaScriptModuleInstruction::create('@blueways/bw-icons/IconSelection.js')
                ->instance($pid, $iconProviders, $parameterArray['itemFormElName']);
        }

        $resultArray['additionalInlineLanguageLabelFiles'][] = 'EXT:bw_icons/Resources/Private/Language/locallang.xlf';

        $defaultInputWidth = 10;
        $size = MathUtility::forceIntegerInRange($config['size'] ?? $defaultInputWidth, $this->minimumInputWidth,
            $this->maxInputWidth);
        $width = (int)$this->formMaxWidth($size);

        /** @var \TYPO3\CMS\Fluid\View\StandaloneView $templateView */
        $templateView = GeneralUtility::makeInstance(StandaloneView::class);
        $templateView->setTemplatePathAndFilename('EXT:bw_icons/Resources/Private/Template/FormElement.html');
        $templateView->assignMultiple([
            'itemFormElName' => $parameterArray['itemFormElName'],
            'itemFormElValue' => $parameterArray['itemFormElValue'],
            'width' => $width,
            'fieldWizardHtml' => $fieldWizardHtml
        ]);

        $resultArray['html'] = $templateView->render();
        return $resultArray;
    }
}
