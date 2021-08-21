<?php

namespace Blueways\BwIcons\Form\Element;

use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;
use TYPO3\CMS\Core\Imaging\Icon;
use TYPO3\CMS\Core\Utility\MathUtility;

class IconSelection extends AbstractFormElement
{

    public function render()
    {
        $resultArray = $this->initializeResultArray();

        $fieldWizardResult = $this->renderFieldWizard();
        $fieldWizardHtml = $fieldWizardResult['html'];
        $resultArray = $this->mergeChildReturnIntoExistingResult($resultArray, $fieldWizardResult, false);
        $parameterArray = $this->data['parameterArray'];
        $config = $parameterArray['fieldConf']['config'];

        $resultArray['requireJsModules'][] = ['TYPO3/CMS/BwIcons/IconSelection' => 'function(IconSelection){top.require([], function() { IconSelection.init("' . $parameterArray['itemFormElName'] . '"); }); }'];

        $resultArray['additionalHiddenFields'][] = '<input type="hidden" name="' . $parameterArray['itemFormElName'] . '" value="' . htmlspecialchars($parameterArray['itemFormElValue']) . '" />';

        $defaultInputWidth = 10;
        $size = MathUtility::forceIntegerInRange($config['size'] ?? $defaultInputWidth, $this->minimumInputWidth,
            $this->maxInputWidth);
        $width = (int)$this->formMaxWidth($size);

        $mainFieldHtml = [];
        $mainFieldHtml[] = '<div data-form-element="' . $parameterArray['itemFormElName'] . '" class="form-control-wrap" style="max-width: ' . $width . 'px">';
        $mainFieldHtml[] = '<div class="form-wizards-wrap">';
        $mainFieldHtml[] = '<div class="form-wizards-element">';
        $mainFieldHtml[] = '<div class="input-group">';

        $mainFieldHtml[] = '<span class="form-control-clearable" style="min-height:32px; background:#FFF; border-radius: 2px 0 0 2px; border:1px solid #CCC; display:block; padding: 6px 12px">';
        $mainFieldHtml[] = '<span class="input-icon-holder">';
        $mainFieldHtml[] = 'icon here';
        $mainFieldHtml[] = '</span>';

        $mainFieldHtml[] = '<button class="close" tabindex="-1" type="button" style="visibility: visible;">';
        $mainFieldHtml[] = $this->iconFactory->getIcon('actions-close', Icon::SIZE_SMALL)->render();
        $mainFieldHtml[] = '</button>';

        $mainFieldHtml[] = '</span>';

        $mainFieldHtml[] = '<span class="input-group-btn">';
        $mainFieldHtml[] = '<button class="btn btn-default t3js-form-field-iconselection" type="button" title="Select Icon">';
        $mainFieldHtml[] = $this->iconFactory->getIcon('actions-search', Icon::SIZE_SMALL)->render();
        $mainFieldHtml[] = '</button>';
        $mainFieldHtml[] = '</span>';

        $mainFieldHtml[] = '</div>';
        $mainFieldHtml[] = '</div>';
        $mainFieldHtml[] = '<div class="form-wizards-items-bottom">';
        $mainFieldHtml[] = $fieldWizardHtml;
        $mainFieldHtml[] = '</div>';
        $mainFieldHtml[] = '</div>';
        $mainFieldHtml[] = '</div>';

        $resultArray['html'] = implode(LF, $mainFieldHtml);
        return $resultArray;
    }
}
