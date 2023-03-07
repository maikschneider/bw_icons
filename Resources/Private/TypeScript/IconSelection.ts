import $ from 'jquery'
// @ts-ignore
import Modal from '@typo3/backend/modal.js'
// @ts-ignore
import AjaxRequest from '@typo3/core/ajax/ajax-request.js';
// @ts-ignore
import AjaxResponse from "@typo3/core/ajax/ajax-response.js";

class IconSelection {

	protected itemFormElName: string;
	protected $formElement: JQuery;
	protected $hiddenElement: JQuery;
	protected selectedIconName: string;
	protected currentModal;
	protected pid: number;
	protected iconProviders: string;
	protected editor;

	protected onModalButtonClick(e: Event) {

		let url = TYPO3.settings.ajaxUrls.icon_selection;
		url += url.indexOf('?') > 0 ? '&' : '?';
		url += 'P[pid]=' + this.pid;
		url += '&P[iconProviders]=' + this.iconProviders;

		Modal.advanced({
			type: Modal.types.ajax,
			content: url,
			size: Modal.sizes.large,
			title: TYPO3.lang.icon_wizard_title,
			callback: (modal) => {
				this.currentModal = modal;
			},
			ajaxCallback: this.onModalLoaded.bind(this),
			buttons: [
				{
					text: TYPO3.lang.icon_wizard_save,
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
		$(this.$hiddenElement).val(this.selectedIconName);
		// @ts-ignore
		$(this.$formElement).find('.input-icon-holder').html(icon);
		if (this.selectedIconName) {
			$(this.$formElement).find('.close').css('visibility', 'visible');
		}
		this.currentModal.hideModal();
	}

	protected onClearButtonClick(e: Event) {
		$(this.$formElement).find('.input-icon-holder').html('');
		$(this.$formElement).find('.close').css('visibility', 'hidden');

		$(this.$hiddenElement).val('');
	}

	protected onModalLoaded() {
		$(this.currentModal).find('a.thumbnail').on('click', this.onIconClick.bind(this));
		$(this.currentModal).find('.nav-tabs a').on('click', this.onNavTabClick.bind(this));
		$(this.currentModal).find('input.search').on('input', this.onFilterInput.bind(this));
		$(this.currentModal).find('.close').on('click', this.onFilterResetClick.bind(this));
	}

	protected onFilterResetClick(e: Event) {
		$(e.currentTarget).parent().find('.search').val('');
		$(this.currentModal).find('input.search').trigger('input');
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
			const id = $(el).attr('href').substr(1);
			const numberOfItems = $tabContent.find('h1[id="' + id + '"] + .icongrid .griditem:not(.hidden)').length;
			// @ts-ignore
			$('span', el).html(numberOfItems);
			if (numberOfItems === 0) {
				$tabContent.find('h1[id="' + id + '"]').addClass('hidden');
				$tabContent.find('h1[id="' + id + '"] + .icongrid').addClass('hidden');
				$(el).addClass('hidden');
			}
		});
		// @ts-ignore
		$('h1:not([id]) span', $tabContent).html($tabContent.find('.griditem:not(.hidden)').length);
	}

	protected onNavTabClick(e: Event) {
		e.preventDefault();
		const tabName = $(e.currentTarget).attr('href').substr(1);
		$(this.currentModal).find('.nav-tabs li, .nav-tabs li a').removeClass('active');
		$(this.currentModal).find('.nav-tabs a[href="#' + tabName + '"]').addClass('active').parent().addClass('active');
		$(this.currentModal).find('.tab-content').removeClass('active');
		$(this.currentModal).find('.tab-content#' + tabName).addClass('active');
	}

	protected onIconClick(e: Event) {
		e.preventDefault();
		$(this.currentModal).find('a.thumbnail').removeClass('active');
		this.selectedIconName = $(e.currentTarget).children().first().attr('data-icon-name');
		$(e.currentTarget).addClass('active');
	}

	protected injectStyleSheets(stylesheets: Array<string>) {
		stylesheets.forEach((sheet) => {

			// include if used in RTE editor
			if (this.editor) {
				this.editor.document.$.head.insertAdjacentHTML(
					'beforeend',
					'<link rel="stylesheet" href="' + sheet + '" />');
			}

			// include for modal
			if (!parent.document.querySelector('link[href*="' + sheet + '"]')) {
				parent.document.getElementsByTagName("head")[0].insertAdjacentHTML(
					'beforeend',
					'<link rel="stylesheet" href="' + sheet + '" />');
			}

		});
	}

	protected loadAndIncludeStylesheets() {
		let url = TYPO3.settings.ajaxUrls.icon_stylesheets;
		url += url.indexOf('?') > 0 ? '&' : '?';
		url += 'pid=' + this.pid;

		new AjaxRequest(url).get().then(async (response: AjaxResponse): Promise<void> => {
			const data = await response.resolve();
			this.injectStyleSheets(data);
		});
	}

	public rteButtonClick() {

		const url = this.editor.config.IconPicker.routeUrl;

		Modal.advanced({
			type: Modal.types.ajax,
			content: url,
			size: Modal.sizes.large,
			title: this.editor.lang.IconPicker.modalTitle,
			callback: (modal) => this.currentModal = modal,
			ajaxCallback: this.onModalLoaded.bind(this),
			buttons: [
				{
					text: this.editor.lang.IconPicker.save,
					name: 'save',
					icon: 'actions-document-save',
					active: true,
					btnClass: 'btn-primary',
					dataAttributes: {
						action: 'save'
					},
					trigger: this.onRteModalSave.bind(this, this.editor)
				}
			]
		});
	}

	protected onRteModalSave(editor) {

		if (this.selectedIconName) {
			const icon = $(this.currentModal).find('*[data-icon-name="' + this.selectedIconName + '"]').get(0);
			// @ts-ignore
			const iconElement = new CKEDITOR.dom.element(icon);
			editor.insertElement(iconElement);
			editor.focus();
		}

		this.currentModal.trigger('modal-dismiss');
	}

	public initForFormElement(itemFormElName: string) {

		this.loadAndIncludeStylesheets();

		// cache dom
		this.itemFormElName = itemFormElName;
		this.$formElement = $('div[data-form-element="' + itemFormElName + '"]');
		this.$hiddenElement = $('input[name="' + itemFormElName + '"]');

		// bind events
		$(this.$formElement).find('.t3js-form-field-iconselection').on('click', this.onModalButtonClick.bind(this));
		$(this.$formElement).find('.close').on('click', this.onClearButtonClick.bind(this));
	}

	public initForRteEditor(editor) {
		this.editor = editor;
		this.loadAndIncludeStylesheets();
	}

	constructor(pid: number, iconProviders: string, itemFormElName: string) {
		this.pid = pid;
		this.iconProviders = iconProviders;
		this.initForFormElement(itemFormElName);
	}


}

export default IconSelection;
