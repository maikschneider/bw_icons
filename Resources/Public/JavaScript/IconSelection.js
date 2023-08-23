define("TYPO3/CMS/BwIcons/IconSelection", ["TYPO3/CMS/Backend/Modal","TYPO3/CMS/Core/Ajax/AjaxRequest","jquery"], (__WEBPACK_EXTERNAL_MODULE_TYPO3_CMS_Backend_Modal__, __WEBPACK_EXTERNAL_MODULE_TYPO3_CMS_Core_Ajax_AjaxRequest__, __WEBPACK_EXTERNAL_MODULE_jquery__) => { return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./Resources/Private/TypeScript/IconSelection.ts":
/*!*******************************************************!*\
  !*** ./Resources/Private/TypeScript/IconSelection.ts ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! jquery */ "jquery"), __webpack_require__(/*! TYPO3/CMS/Backend/Modal */ "TYPO3/CMS/Backend/Modal"), __webpack_require__(/*! TYPO3/CMS/Core/Ajax/AjaxRequest */ "TYPO3/CMS/Core/Ajax/AjaxRequest")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, $, Modal, AjaxRequest) {
    "use strict";
    /**
     * Module: TYPO3/CMS/BwIcons/IconSelection
     *
     * @exports TYPO3/CMS/BwIcons/IconSelection
     */
    class IconSelection {
        constructor(pid, iconProviders) {
            this.pid = pid;
            this.iconProviders = iconProviders;
        }
        onModalButtonClick(e) {
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
        onModalSave() {
            const icon = $(this.currentModal).find('*[data-icon-name="' + this.selectedIconName + '"]').clone();
            this.$hiddenElement.val(this.selectedIconName);
            // @ts-ignore
            $(this.$formElement).find('.input-icon-holder').html(icon);
            if (this.selectedIconName) {
                this.$formElement.find('.close').css('visibility', 'visible');
            }
            Modal.currentModal.trigger('modal-dismiss');
        }
        onClearButtonClick(e) {
            this.$formElement.find('.input-icon-holder').html('');
            this.$formElement.find('.close').css('visibility', 'hidden');
            this.$hiddenElement.val('');
        }
        onModalLoaded() {
            this.currentModal.find('a.thumbnail').on('click', this.onIconClick.bind(this));
            this.currentModal.find('.nav-tabs a').on('click', this.onNavTabClick.bind(this));
            this.currentModal.find('input.search').on('input', this.onFilterInput.bind(this));
            this.currentModal.find('.close').on('click', this.onFilterResetClick.bind(this));
        }
        onFilterResetClick(e) {
            $(e.currentTarget).parent().find('.search').val('');
            this.currentModal.find('input.search').trigger('input');
        }
        onFilterInput(e) {
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
        onNavTabClick(e) {
            e.preventDefault();
            const tabName = $(e.currentTarget).attr('href').substr(1);
            this.currentModal.find('.nav-tabs li, .nav-tabs li a').removeClass('active');
            this.currentModal.find('.nav-tabs a[href="#' + tabName + '"]').addClass('active').parent().addClass('active');
            this.currentModal.find('.tab-content').removeClass('active');
            this.currentModal.find('.tab-content#' + tabName).addClass('active');
        }
        onIconClick(e) {
            e.preventDefault();
            this.currentModal.find('a.thumbnail').removeClass('active');
            this.selectedIconName = $(e.currentTarget).children().first().attr('data-icon-name');
            $(e.currentTarget).addClass('active');
        }
        injectStyleSheets(stylesheets) {
            // in case typo3 backend is prefixed, e.g. /sub-path/typo3
            const prefixStrings = [];
            const pathArray = window.location.pathname.split('/').filter(n => n);
            for (let i = 0; i < pathArray.length; i++) {
                if (pathArray[i] === 'typo3') {
                    break;
                }
                prefixStrings.push(pathArray[i]);
            }
            const prefix = prefixStrings.length ? '/' + prefixStrings.join('/') : '';
            stylesheets.forEach((sheet) => {
                const sheetPath = prefix + sheet;
                // include if used in RTE editor
                if (this.editor) {
                    this.editor.document.$.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + sheetPath + '" />');
                }
                // include for modal
                if (!parent.document.querySelector('link[href*="' + sheetPath + '"]')) {
                    parent.document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + sheetPath + '" />');
                }
            });
        }
        loadAndIncludeStylesheets() {
            let url = TYPO3.settings.ajaxUrls.icon_stylesheets;
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += 'pid=' + this.pid;
            new AjaxRequest(url).get().then(async (response) => {
                const data = await response.resolve();
                this.injectStyleSheets(data);
            });
        }
        rteButtonClick() {
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
        onRteModalSave(editor) {
            if (this.selectedIconName) {
                const icon = $(this.currentModal).find('*[data-icon-name="' + this.selectedIconName + '"]').get(0);
                // @ts-ignore
                const iconElement = new CKEDITOR.dom.element(icon);
                editor.insertElement(iconElement);
                editor.focus();
            }
            this.currentModal.trigger('modal-dismiss');
        }
        initForFormElement(itemFormElName) {
            this.loadAndIncludeStylesheets();
            // cache dom
            this.itemFormElName = itemFormElName;
            this.$formElement = $('div[data-form-element="' + itemFormElName + '"]');
            this.$hiddenElement = $('input[name="' + itemFormElName + '"]');
            // bind events
            this.$formElement.find('.t3js-form-field-iconselection').on('click', this.onModalButtonClick.bind(this));
            this.$formElement.find('.close').on('click', this.onClearButtonClick.bind(this));
        }
        initForRteEditor(editor) {
            this.editor = editor;
            this.loadAndIncludeStylesheets();
        }
    }
    return IconSelection;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "TYPO3/CMS/Backend/Modal":
/*!******************************************!*\
  !*** external "TYPO3/CMS/Backend/Modal" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_TYPO3_CMS_Backend_Modal__;

/***/ }),

/***/ "TYPO3/CMS/Core/Ajax/AjaxRequest":
/*!**************************************************!*\
  !*** external "TYPO3/CMS/Core/Ajax/AjaxRequest" ***!
  \**************************************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_TYPO3_CMS_Core_Ajax_AjaxRequest__;

/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jquery" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = __WEBPACK_EXTERNAL_MODULE_jquery__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module used 'module' so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./Resources/Private/TypeScript/IconSelection.ts");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VzL1B1YmxpYy9KYXZhU2NyaXB0L0ljb25TZWxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUdBQU8sQ0FBQyxtQkFBUyxFQUFFLE9BQVMsRUFBRSwyQ0FBUSxFQUFFLDZFQUF5QixFQUFFLDZGQUFpQyxDQUFDLG1DQUFFO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixzQkFBc0I7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUFBLGtHQUFDOzs7Ozs7Ozs7Ozs7QUNoTUY7Ozs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy8vLi9SZXNvdXJjZXMvUHJpdmF0ZS9UeXBlU2NyaXB0L0ljb25TZWxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvL2V4dGVybmFsIGFtZCBcIlRZUE8zL0NNUy9CYWNrZW5kL01vZGFsXCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvL2V4dGVybmFsIGFtZCBcIlRZUE8zL0NNUy9Db3JlL0FqYXgvQWpheFJlcXVlc3RcIiIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy8vZXh0ZXJuYWwgYW1kIFwianF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoW1wicmVxdWlyZVwiLCBcImV4cG9ydHNcIiwgXCJqcXVlcnlcIiwgXCJUWVBPMy9DTVMvQmFja2VuZC9Nb2RhbFwiLCBcIlRZUE8zL0NNUy9Db3JlL0FqYXgvQWpheFJlcXVlc3RcIl0sIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCAkLCBNb2RhbCwgQWpheFJlcXVlc3QpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvKipcbiAgICAgKiBNb2R1bGU6IFRZUE8zL0NNUy9Cd0ljb25zL0ljb25TZWxlY3Rpb25cbiAgICAgKlxuICAgICAqIEBleHBvcnRzIFRZUE8zL0NNUy9Cd0ljb25zL0ljb25TZWxlY3Rpb25cbiAgICAgKi9cbiAgICBjbGFzcyBJY29uU2VsZWN0aW9uIHtcbiAgICAgICAgY29uc3RydWN0b3IocGlkLCBpY29uUHJvdmlkZXJzKSB7XG4gICAgICAgICAgICB0aGlzLnBpZCA9IHBpZDtcbiAgICAgICAgICAgIHRoaXMuaWNvblByb3ZpZGVycyA9IGljb25Qcm92aWRlcnM7XG4gICAgICAgIH1cbiAgICAgICAgb25Nb2RhbEJ1dHRvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgIGxldCB1cmwgPSBUWVBPMy5zZXR0aW5ncy5hamF4VXJscy5pY29uX3NlbGVjdGlvbjtcbiAgICAgICAgICAgIHVybCArPSB1cmwuaW5kZXhPZignPycpID4gMCA/ICcmJyA6ICc/JztcbiAgICAgICAgICAgIHVybCArPSAnUFtwaWRdPScgKyB0aGlzLnBpZDtcbiAgICAgICAgICAgIHVybCArPSAnJlBbaWNvblByb3ZpZGVyc109JyArIHRoaXMuaWNvblByb3ZpZGVycztcbiAgICAgICAgICAgIE1vZGFsLmFkdmFuY2VkKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBNb2RhbC50eXBlcy5hamF4LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHVybCxcbiAgICAgICAgICAgICAgICBzaXplOiBNb2RhbC5zaXplcy5sYXJnZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogVFlQTzMubGFuZy5pY29uX3dpemFyZF90aXRsZSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKG1vZGFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsID0gbW9kYWw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhamF4Q2FsbGJhY2s6IHRoaXMub25Nb2RhbExvYWRlZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogVFlQTzMubGFuZy5pY29uX3dpemFyZF9zYXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2FjdGlvbnMtZG9jdW1lbnQtc2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBidG5DbGFzczogJ2J0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnc2F2ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0aGlzLm9uTW9kYWxTYXZlLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxTYXZlKCkge1xuICAgICAgICAgICAgY29uc3QgaWNvbiA9ICQodGhpcy5jdXJyZW50TW9kYWwpLmZpbmQoJypbZGF0YS1pY29uLW5hbWU9XCInICsgdGhpcy5zZWxlY3RlZEljb25OYW1lICsgJ1wiXScpLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50LnZhbCh0aGlzLnNlbGVjdGVkSWNvbk5hbWUpO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJCh0aGlzLiRmb3JtRWxlbWVudCkuZmluZCgnLmlucHV0LWljb24taG9sZGVyJykuaHRtbChpY29uKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSWNvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgTW9kYWwuY3VycmVudE1vZGFsLnRyaWdnZXIoJ21vZGFsLWRpc21pc3MnKTtcbiAgICAgICAgfVxuICAgICAgICBvbkNsZWFyQnV0dG9uQ2xpY2soZSkge1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmlucHV0LWljb24taG9sZGVyJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50LnZhbCgnJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25Nb2RhbExvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2EudGh1bWJuYWlsJykub24oJ2NsaWNrJywgdGhpcy5vbkljb25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBhJykub24oJ2NsaWNrJywgdGhpcy5vbk5hdlRhYkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnaW5wdXQuc2VhcmNoJykub24oJ2lucHV0JywgdGhpcy5vbkZpbHRlcklucHV0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLmNsb3NlJykub24oJ2NsaWNrJywgdGhpcy5vbkZpbHRlclJlc2V0Q2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgb25GaWx0ZXJSZXNldENsaWNrKGUpIHtcbiAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5wYXJlbnQoKS5maW5kKCcuc2VhcmNoJykudmFsKCcnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2lucHV0LnNlYXJjaCcpLnRyaWdnZXIoJ2lucHV0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgb25GaWx0ZXJJbnB1dChlKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hQaHJhc2UgPSAkKGUuY3VycmVudFRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICBjb25zdCAkdGFiQ29udGVudCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCcudGFiLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIC8vIHJlc2V0IGFsbCBpdGVtc1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmdyaWRpdGVtJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnaDEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcubGlzdC1ncm91cC1pdGVtJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmljb25ncmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgLy8gZmlsdGVyIGl0ZW1zXG4gICAgICAgICAgICBpZiAoc2VhcmNoUGhyYXNlKSB7XG4gICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnKltkYXRhLWljb24tbmFtZV0nKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnKltkYXRhLWljb24tYmFzZS1uYW1lKj1cIicgKyBzZWFyY2hQaHJhc2UgKyAnXCJdJykucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5jbG9zZScpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgY291bnRlclxuICAgICAgICAgICAgJCgnLmxpc3QtZ3JvdXAtaXRlbScsICR0YWJDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gJChlbCkuYXR0cignaHJlZicpLnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgICBjb25zdCBudW1iZXJPZkl0ZW1zID0gJHRhYkNvbnRlbnQuZmluZCgnaDFbaWQ9XCInICsgaWQgKyAnXCJdICsgLmljb25ncmlkIC5ncmlkaXRlbTpub3QoLmhpZGRlbiknKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICQoJ3NwYW4nLCBlbCkuaHRtbChudW1iZXJPZkl0ZW1zKTtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyT2ZJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCdoMVtpZD1cIicgKyBpZCArICdcIl0nKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJ2gxW2lkPVwiJyArIGlkICsgJ1wiXSArIC5pY29uZ3JpZCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJCgnaDE6bm90KFtpZF0pIHNwYW4nLCAkdGFiQ29udGVudCkuaHRtbCgkdGFiQ29udGVudC5maW5kKCcuZ3JpZGl0ZW06bm90KC5oaWRkZW4pJykubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBvbk5hdlRhYkNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHRhYk5hbWUgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBsaSwgLm5hdi10YWJzIGxpIGEnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcubmF2LXRhYnMgYVtocmVmPVwiIycgKyB0YWJOYW1lICsgJ1wiXScpLmFkZENsYXNzKCdhY3RpdmUnKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcudGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcudGFiLWNvbnRlbnQjJyArIHRhYk5hbWUpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBvbkljb25DbGljayhlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdhLnRodW1ibmFpbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJY29uTmFtZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5jaGlsZHJlbigpLmZpcnN0KCkuYXR0cignZGF0YS1pY29uLW5hbWUnKTtcbiAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaW5qZWN0U3R5bGVTaGVldHMoc3R5bGVzaGVldHMpIHtcbiAgICAgICAgICAgIC8vIGluIGNhc2UgdHlwbzMgYmFja2VuZCBpcyBwcmVmaXhlZCwgZS5nLiAvc3ViLXBhdGgvdHlwbzNcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeFN0cmluZ3MgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhBcnJheSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpLmZpbHRlcihuID0+IG4pO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRoQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGF0aEFycmF5W2ldID09PSAndHlwbzMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmVmaXhTdHJpbmdzLnB1c2gocGF0aEFycmF5W2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IHByZWZpeFN0cmluZ3MubGVuZ3RoID8gJy8nICsgcHJlZml4U3RyaW5ncy5qb2luKCcvJykgOiAnJztcbiAgICAgICAgICAgIHN0eWxlc2hlZXRzLmZvckVhY2goKHNoZWV0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2hlZXRQYXRoID0gcHJlZml4ICsgc2hlZXQ7XG4gICAgICAgICAgICAgICAgLy8gaW5jbHVkZSBpZiB1c2VkIGluIFJURSBlZGl0b3JcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lZGl0b3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0b3IuZG9jdW1lbnQuJC5oZWFkLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJyArIHNoZWV0UGF0aCArICdcIiAvPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpbmNsdWRlIGZvciBtb2RhbFxuICAgICAgICAgICAgICAgIGlmICghcGFyZW50LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZio9XCInICsgc2hlZXRQYXRoICsgJ1wiXScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCInICsgc2hlZXRQYXRoICsgJ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbG9hZEFuZEluY2x1ZGVTdHlsZXNoZWV0cygpIHtcbiAgICAgICAgICAgIGxldCB1cmwgPSBUWVBPMy5zZXR0aW5ncy5hamF4VXJscy5pY29uX3N0eWxlc2hlZXRzO1xuICAgICAgICAgICAgdXJsICs9IHVybC5pbmRleE9mKCc/JykgPiAwID8gJyYnIDogJz8nO1xuICAgICAgICAgICAgdXJsICs9ICdwaWQ9JyArIHRoaXMucGlkO1xuICAgICAgICAgICAgbmV3IEFqYXhSZXF1ZXN0KHVybCkuZ2V0KCkudGhlbihhc3luYyAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5qZWN0U3R5bGVTaGVldHMoZGF0YSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBydGVCdXR0b25DbGljaygpIHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IHRoaXMuZWRpdG9yLmNvbmZpZy5JY29uUGlja2VyLnJvdXRlVXJsO1xuICAgICAgICAgICAgTW9kYWwuYWR2YW5jZWQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IE1vZGFsLnR5cGVzLmFqYXgsXG4gICAgICAgICAgICAgICAgY29udGVudDogdXJsLFxuICAgICAgICAgICAgICAgIHNpemU6IE1vZGFsLnNpemVzLmxhcmdlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiB0aGlzLmVkaXRvci5sYW5nLkljb25QaWNrZXIubW9kYWxUaXRsZSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKG1vZGFsKSA9PiB0aGlzLmN1cnJlbnRNb2RhbCA9IG1vZGFsLFxuICAgICAgICAgICAgICAgIGFqYXhDYWxsYmFjazogdGhpcy5vbk1vZGFsTG9hZGVkLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmVkaXRvci5sYW5nLkljb25QaWNrZXIuc2F2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdzYXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdhY3Rpb25zLWRvY3VtZW50LXNhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnRuQ2xhc3M6ICdidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3NhdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogdGhpcy5vblJ0ZU1vZGFsU2F2ZS5iaW5kKHRoaXMsIHRoaXMuZWRpdG9yKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgb25SdGVNb2RhbFNhdmUoZWRpdG9yKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEljb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWNvbiA9ICQodGhpcy5jdXJyZW50TW9kYWwpLmZpbmQoJypbZGF0YS1pY29uLW5hbWU9XCInICsgdGhpcy5zZWxlY3RlZEljb25OYW1lICsgJ1wiXScpLmdldCgwKTtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgY29uc3QgaWNvbkVsZW1lbnQgPSBuZXcgQ0tFRElUT1IuZG9tLmVsZW1lbnQoaWNvbik7XG4gICAgICAgICAgICAgICAgZWRpdG9yLmluc2VydEVsZW1lbnQoaWNvbkVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGVkaXRvci5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwudHJpZ2dlcignbW9kYWwtZGlzbWlzcycpO1xuICAgICAgICB9XG4gICAgICAgIGluaXRGb3JGb3JtRWxlbWVudChpdGVtRm9ybUVsTmFtZSkge1xuICAgICAgICAgICAgdGhpcy5sb2FkQW5kSW5jbHVkZVN0eWxlc2hlZXRzKCk7XG4gICAgICAgICAgICAvLyBjYWNoZSBkb21cbiAgICAgICAgICAgIHRoaXMuaXRlbUZvcm1FbE5hbWUgPSBpdGVtRm9ybUVsTmFtZTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50ID0gJCgnZGl2W2RhdGEtZm9ybS1lbGVtZW50PVwiJyArIGl0ZW1Gb3JtRWxOYW1lICsgJ1wiXScpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudCA9ICQoJ2lucHV0W25hbWU9XCInICsgaXRlbUZvcm1FbE5hbWUgKyAnXCJdJyk7XG4gICAgICAgICAgICAvLyBiaW5kIGV2ZW50c1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLnQzanMtZm9ybS1maWVsZC1pY29uc2VsZWN0aW9uJykub24oJ2NsaWNrJywgdGhpcy5vbk1vZGFsQnV0dG9uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5vbignY2xpY2snLCB0aGlzLm9uQ2xlYXJCdXR0b25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBpbml0Rm9yUnRlRWRpdG9yKGVkaXRvcikge1xuICAgICAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XG4gICAgICAgICAgICB0aGlzLmxvYWRBbmRJbmNsdWRlU3R5bGVzaGVldHMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSWNvblNlbGVjdGlvbjtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX1RZUE8zX0NNU19CYWNrZW5kX01vZGFsX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX1RZUE8zX0NNU19Db3JlX0FqYXhfQWpheFJlcXVlc3RfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfanF1ZXJ5X187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL1Jlc291cmNlcy9Qcml2YXRlL1R5cGVTY3JpcHQvSWNvblNlbGVjdGlvbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==