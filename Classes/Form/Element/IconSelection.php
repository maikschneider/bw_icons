<?php

namespace Blueways\BwIcons\Form\Element;

use Blueways\BwIcons\Domain\Model\Dto\WizardConfig;
use Blueways\BwIcons\Domain\Model\Dto\WizardIcon;
use Blueways\BwIcons\Utility\HelperUtility;
use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;
use TYPO3\CMS\Core\Core\Environment;
use TYPO3\CMS\Core\Page\JavaScriptModuleInstruction;
use TYPO3\CMS\Core\Utility\GeneralUtility;
use TYPO3\CMS\Core\Utility\StringUtility;

class IconSelection extends AbstractFormElement
{
    public function render(): array
    {
        $resultArray = $this->initializeResultArray();
        $fieldId = StringUtility::getUniqueId('formengine-input-');

        $fieldWizardResult = $this->renderFieldWizard();
        $resultArray = $this->mergeChildReturnIntoExistingResult($resultArray, $fieldWizardResult, false);
        $parameterArray = $this->data['parameterArray'];
        $wizardConfig = WizardConfig::createFromFormElementData($this->data);

        $helperUtil = GeneralUtility::makeInstance(HelperUtility::class, $wizardConfig);
        $styleSheets = $helperUtil->getStyleSheets();
        $styleSheetPaths = array_map(static function ($styleSheet) {
            return Environment::getPublicPath() . $styleSheet;
        }, $styleSheets);
        $resultArray['stylesheetFiles'] = $styleSheetPaths;
        $resultArray['javaScriptModules'][] = JavaScriptModuleInstruction::create('@blueways/bw-icons/IconElement.js');
        $resultArray['additionalInlineLanguageLabelFiles'][] = 'EXT:bw_icons/Resources/Private/Language/locallang.xlf';

        $itemFormElValue = $parameterArray['itemFormElValue'];
        $itemFormElName = $parameterArray['itemFormElName'];
        $description = $parameterArray['fieldConf']['description'] ?? '';

        $currentIcon = $itemFormElValue ? new WizardIcon($itemFormElValue) : null;

        $html = $wizardConfig->typo3Version > 12 ? $this->renderLabel($fieldId) : '';
        $html .= '<div class="formengine-field-item t3js-formengine-field-item">';
        $html .= '<div class="form-wizards-wrap">';
        $html .= '<div class="form-wizards-element">';
        $html .= $description ? '<div class="form-description">' . htmlspecialchars($description) . '</div>' : '';
        $html .= '<div class="form-control-wrap">';
        $html .= '<bw-icon-element ';
        $html .= 'itemFormElValue="' . htmlspecialchars($itemFormElValue, ENT_QUOTES) . '"';
        $html .= 'itemFormElName="' . $itemFormElName . '"';
        $html .= 'currentIconJson="' . htmlspecialchars(json_encode($currentIcon, JSON_THROW_ON_ERROR)) . '"';
        $html .= 'wizardConfig="' . htmlspecialchars(json_encode($wizardConfig, JSON_THROW_ON_ERROR)) . '"';
        $html .= ' />';
        $html .= '</div>';
        $html .= '</div>';
        $html .= '</div>';
        $html .= '</div>';

        $resultArray['html'] = $html;
        return $resultArray;
    }
}
