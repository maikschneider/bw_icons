<?php

namespace Blueways\BwIcons\Form\Element;

use TYPO3\CMS\Backend\Form\Element\AbstractFormElement;

class IconSelection extends AbstractFormElement
{

    public function render()
    {
        $resultArray = $this->initializeResultArray();

        $fieldWizardResult = $this->renderFieldWizard();
        $fieldWizardHtml = $fieldWizardResult['html'];
        $resultArray = $this->mergeChildReturnIntoExistingResult($resultArray, $fieldWizardResult, false);

        $mainFieldHtml = [];
        $mainFieldHtml[] = '<div class="form-control-wrap">';
        $mainFieldHtml[] = '<div class="form-wizards-wrap">';
        $mainFieldHtml[] = '<div class="form-wizards-element">';
        $mainFieldHtml[] = 'HELLO!';
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
