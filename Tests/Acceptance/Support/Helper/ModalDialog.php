<?php

namespace Blueways\BwIconsTest\Acceptance\Support\Helper;

use TYPO3\TestingFramework\Core\Acceptance\Helper\AbstractModalDialog;

class ModalDialog extends AbstractModalDialog
{
    public static $openedModalSelector = '.modal';

    public static $openedModalButtonContainerSelector = '.modal .modal-footer';
}
