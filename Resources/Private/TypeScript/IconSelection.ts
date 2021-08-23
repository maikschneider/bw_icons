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
	protected selectedIconName: string;
	protected currentModal;
	protected pid: number;

	protected onModalButtonClick(e: Event) {
		Modal.advanced({
			type: Modal.types.ajax,
			content: window.TYPO3.settings.ajaxUrls.icon_selection + '&pid=' + this.pid,
			size: Modal.sizes.large,
			title: 'Select Icon',
			callback: (modal) => {
				this.currentModal = modal;
			},
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
					trigger: this.onModalSave.bind(this)
				}
			]
		});

	}

	protected onModalSave() {
		const icon = $(this.currentModal).find('*[data-icon-name="' + this.selectedIconName + '"]').clone();
		this.$hiddenElement.val(this.selectedIconName);
		// @ts-ignore
		$(this.$formElement).find('.input-icon-holder').html(icon);
		if (this.selectedIconName) {
			this.$formElement.find('.close').css('visibility', 'visible');
		}
		Modal.currentModal.trigger('modal-dismiss');
	}

	protected onClearButtonClick(e: Event) {
		this.$formElement.find('.input-icon-holder').html('');
		this.$formElement.find('.close').css('visibility', 'hidden');

		this.$hiddenElement.val('');
	}

	protected onModalLoaded() {
		this.currentModal.find('a.thumbnail').on('click', this.onIconClick.bind(this));
		this.currentModal.find('.nav-tabs a').on('click', this.onNavTabClick.bind(this));
		this.currentModal.find('input.search').on('input', this.onFilterInput.bind(this));
		this.currentModal.find('.close').on('click', this.onFilterResetClick.bind(this));
	}

	protected onFilterResetClick(e: Event) {
		$(e.currentTarget).parent().find('.search').val('');
		this.currentModal.find('input.search').trigger('input');
	}

	protected onFilterInput(e: Event) {
		const searchPhrase = $(e.currentTarget).val();
		const $tabContent = $(e.currentTarget).closest('.tab-content');

		// reset all items
		$tabContent.find('.griditem').removeClass('hidden');
		$tabContent.find('h1').removeClass('hidden');
		$tabContent.find('.list-group-item').removeClass('hidden');
		$tabContent.find('.icongrid').removeClass('hidden');
		$tabContent.find('.close').css('visibility', 'hidden');

		// filter items
		if (searchPhrase) {
			$tabContent.find('*[data-icon-name]').parent().parent().addClass('hidden');
			$tabContent.find('*[data-icon-base-name*="' + searchPhrase + '"]').parent().parent().removeClass('hidden');
			$tabContent.find('.close').css('visibility', 'visible');
		}

		// update counter
		$('.list-group-item', $tabContent).each(function (i, el) {
			const id = $(el).attr('href');
			const numberOfItems = $tabContent.find('h1' + id + ' + .icongrid .griditem:not(.hidden)').length;
			// @ts-ignore
			$('span', el).html(numberOfItems);
			if (numberOfItems === 0) {
				$tabContent.find('h1' + id).addClass('hidden');
				$tabContent.find('h1' + id + ' + .icongrid').addClass('hidden');
				$(el).addClass('hidden');
			}
		});
	}

	protected onNavTabClick(e: Event) {
		e.preventDefault();
		const tabName = $(e.currentTarget).attr('href').substr(1);
		this.currentModal.find('.nav-tabs li').removeClass('active');
		this.currentModal.find('.nav-tabs a[href="#' + tabName + '"]').parent().addClass('active');
		this.currentModal.find('.tab-content').removeClass('active');
		this.currentModal.find('.tab-content#' + tabName).addClass('active');
	}

	protected onIconClick(e: Event) {
		e.preventDefault();
		this.currentModal.find('a.thumbnail').removeClass('active');
		this.selectedIconName = $(e.currentTarget).children().first().attr('data-icon-name');
		$(e.currentTarget).addClass('active');
	}

	public init(pid: number, itemFormElName: string, styleSheets: []) {

		this.pid = pid;

		// add stylesheet to global frame (to display icons in modal)
		// @TODO: remove on close
		styleSheets.forEach((sheet) => {
			parent.document.getElementsByTagName("head")[0].insertAdjacentHTML(
				'beforeend',
				'<link rel="stylesheet" href="' + sheet + '" />');
		});

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
