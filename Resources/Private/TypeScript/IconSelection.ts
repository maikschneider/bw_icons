import $ = require('jquery');
// @ts-ignore
import Modal = require('TYPO3/CMS/Backend/Modal');

declare global {
	interface Window {
		TYPO3: any;
	}
}

/**
 * Module: TYPO3/CMS/BwIcons/IconSelection
 *
 * @exports TYPO3/CMS/BwIcons/IconSelection
 */
class IconSelection {

	public constructor() {
		console.log(window.TYPO3.settings.ajaxUrls);
		$('.t3js-form-field-iconselection').on('click', this.onButtonClick.bind(this));
	}

	protected onButtonClick(e: Event) {


		Modal.advanced({
			type: 'ajax',
			content: window.TYPO3.settings.ajaxUrls.icon_selection
		});

	}
}

export = new IconSelection();
