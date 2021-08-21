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

        $parameterArray = $this->data['parameterArray'];
        $resultArray['additionalHiddenFields'][] = '<input type="hidden" name="' . $parameterArray['itemFormElName'] . '" value="' . htmlspecialchars($parameterArray['itemFormElValue']) . '" />';

        $defaultInputWidth = 10;
        $size = MathUtility::forceIntegerInRange($config['size'] ?? $defaultInputWidth, $this->minimumInputWidth,
            $this->maxInputWidth);
        $width = (int)$this->formMaxWidth($size);

        $mainFieldHtml = [];
        $mainFieldHtml[] = '<div class="form-control-wrap" style="max-width: ' . $width . 'px">';
        $mainFieldHtml[] = '<div class="form-wizards-wrap">';
        $mainFieldHtml[] = '<div class="form-wizards-element">';
        $mainFieldHtml[] = '<div class="input-group">';

        $mainFieldHtml[] = '<span class="form-control-clearable" style="background:#FFF; border-radius: 2px 0 0 2px; border:1px solid #CCC; display:block; padding: 6px 12px">';
        $mainFieldHtml[] = 'icon here';


        $mainFieldHtml[] = '<button class="close" tabindex="-1" type="button" style="visibility: visible;">';
        $mainFieldHtml[] = $this->iconFactory->getIcon('actions-close', Icon::SIZE_SMALL)->render();
        $mainFieldHtml[] = '</button>';

        $mainFieldHtml[] = '</span>';

        $mainFieldHtml[] = '<span class="input-group-btn">';
        $mainFieldHtml[] = '<button class="btn btn-default t3js-form-field-inputlink-explanation-toggle" type="button" title="TITLE">';
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
