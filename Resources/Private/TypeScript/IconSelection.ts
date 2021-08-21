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

	protected itemFormElName: string;
	protected $formElement: JQuery;
	protected $hiddenElement: JQuery;

	protected onModalButtonClick(e: Event) {
		Modal.advanced({
			type: Modal.types.ajax,
			content: window.TYPO3.settings.ajaxUrls.icon_selection,
			size: Modal.sizes.large,
			title: 'Select Icon',
			ajaxCallback: this.onModalLoaded.bind(this),
			buttons: [
				{
					text: 'Save changes',
					name: 'save',
					icon: 'actions-document-save',
					active: true,
					btnClass: 'btn-primary',
					dataAttributes: {
						action: 'save'
					},
					trigger: function () {
						Modal.currentModal.trigger('modal-dismiss');
					}
				}
			]
		});

	}

	protected onClearButtonClick(e: Event) {
		this.$formElement.find('.input-icon-holder').html('');
		this.$hiddenElement.val('');
	}

	protected onModalLoaded() {

	}

	public init(itemFormElName: string) {

		// cache dom
		this.itemFormElName = itemFormElName;
		this.$formElement = $('div[data-form-element="' + itemFormElName + '"]');
		this.$hiddenElement = $('input[name="' + itemFormElName + '"]');

		// bind events
		this.$formElement.find('.t3js-form-field-iconselection').on('click', this.onModalButtonClick.bind(this));
		this.$formElement.find('.close').on('click', this.onClearButtonClick.bind(this));
	}
}

export = new IconSelection();
