define("TYPO3/CMS/BwIcons/IconSelection", ["TYPO3/CMS/Backend/Modal","jquery"], (__WEBPACK_EXTERNAL_MODULE_TYPO3_CMS_Backend_Modal__, __WEBPACK_EXTERNAL_MODULE_jquery__) => { return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./Resources/Private/TypeScript/IconSelection.ts":
/*!*******************************************************!*\
  !*** ./Resources/Private/TypeScript/IconSelection.ts ***!
  \*******************************************************/
/***/ ((module, exports, __webpack_require__) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! jquery */ "jquery"), __webpack_require__(/*! TYPO3/CMS/Backend/Modal */ "TYPO3/CMS/Backend/Modal")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, $, Modal) {
    "use strict";
    /**
     * Module: TYPO3/CMS/BwIcons/IconSelection
     *
     * @exports TYPO3/CMS/BwIcons/IconSelection
     */
    class IconSelection {
        onModalButtonClick(e) {
            this.injectStyleSheets();
            let url = TYPO3.settings.ajaxUrls.icon_selection;
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += 'pid=' + this.pid;
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
        injectStyleSheets() {
            this.styleSheets.forEach((sheet) => {
                if (!parent.document.querySelector('link[href*="' + sheet + '"]')) {
                    parent.document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + sheet + '" />');
                }
            });
        }
        init(pid, itemFormElName, styleSheets) {
            this.pid = pid;
            this.styleSheets = styleSheets;
            // cache dom
            this.itemFormElName = itemFormElName;
            this.$formElement = $('div[data-form-element="' + itemFormElName + '"]');
            this.$hiddenElement = $('input[name="' + itemFormElName + '"]');
            // bind events
            this.$formElement.find('.t3js-form-field-iconselection').on('click', this.onModalButtonClick.bind(this));
            this.$formElement.find('.close').on('click', this.onClearButtonClick.bind(this));
        }
    }
    return new IconSelection();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VzL1B1YmxpYy9KYXZhU2NyaXB0L0ljb25TZWxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUdBQU8sQ0FBQyxtQkFBUyxFQUFFLE9BQVMsRUFBRSwyQ0FBUSxFQUFFLDZFQUF5QixDQUFDLG1DQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUFBLGtHQUFDOzs7Ozs7Ozs7Ozs7QUM5SEY7Ozs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy9bbmFtZV0vLi9SZXNvdXJjZXMvUHJpdmF0ZS9UeXBlU2NyaXB0L0ljb25TZWxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL2V4dGVybmFsIFwiVFlQTzMvQ01TL0JhY2tlbmQvTW9kYWxcIiIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy9bbmFtZV0vZXh0ZXJuYWwgXCJqcXVlcnlcIiIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy9bbmFtZV0vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy9bbmFtZV0vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImRlZmluZShbXCJyZXF1aXJlXCIsIFwiZXhwb3J0c1wiLCBcImpxdWVyeVwiLCBcIlRZUE8zL0NNUy9CYWNrZW5kL01vZGFsXCJdLCBmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgJCwgTW9kYWwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvKipcbiAgICAgKiBNb2R1bGU6IFRZUE8zL0NNUy9Cd0ljb25zL0ljb25TZWxlY3Rpb25cbiAgICAgKlxuICAgICAqIEBleHBvcnRzIFRZUE8zL0NNUy9Cd0ljb25zL0ljb25TZWxlY3Rpb25cbiAgICAgKi9cbiAgICBjbGFzcyBJY29uU2VsZWN0aW9uIHtcbiAgICAgICAgb25Nb2RhbEJ1dHRvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgIHRoaXMuaW5qZWN0U3R5bGVTaGVldHMoKTtcbiAgICAgICAgICAgIGxldCB1cmwgPSBUWVBPMy5zZXR0aW5ncy5hamF4VXJscy5pY29uX3NlbGVjdGlvbjtcbiAgICAgICAgICAgIHVybCArPSB1cmwuaW5kZXhPZignPycpID4gMCA/ICcmJyA6ICc/JztcbiAgICAgICAgICAgIHVybCArPSAncGlkPScgKyB0aGlzLnBpZDtcbiAgICAgICAgICAgIE1vZGFsLmFkdmFuY2VkKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBNb2RhbC50eXBlcy5hamF4LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHVybCxcbiAgICAgICAgICAgICAgICBzaXplOiBNb2RhbC5zaXplcy5sYXJnZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogVFlQTzMubGFuZy5pY29uX3dpemFyZF90aXRsZSxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKG1vZGFsKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsID0gbW9kYWw7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhamF4Q2FsbGJhY2s6IHRoaXMub25Nb2RhbExvYWRlZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogVFlQTzMubGFuZy5pY29uX3dpemFyZF9zYXZlLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2FjdGlvbnMtZG9jdW1lbnQtc2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBidG5DbGFzczogJ2J0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnc2F2ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0aGlzLm9uTW9kYWxTYXZlLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxTYXZlKCkge1xuICAgICAgICAgICAgY29uc3QgaWNvbiA9ICQodGhpcy5jdXJyZW50TW9kYWwpLmZpbmQoJypbZGF0YS1pY29uLW5hbWU9XCInICsgdGhpcy5zZWxlY3RlZEljb25OYW1lICsgJ1wiXScpLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50LnZhbCh0aGlzLnNlbGVjdGVkSWNvbk5hbWUpO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJCh0aGlzLiRmb3JtRWxlbWVudCkuZmluZCgnLmlucHV0LWljb24taG9sZGVyJykuaHRtbChpY29uKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSWNvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgTW9kYWwuY3VycmVudE1vZGFsLnRyaWdnZXIoJ21vZGFsLWRpc21pc3MnKTtcbiAgICAgICAgfVxuICAgICAgICBvbkNsZWFyQnV0dG9uQ2xpY2soZSkge1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmlucHV0LWljb24taG9sZGVyJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50LnZhbCgnJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25Nb2RhbExvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2EudGh1bWJuYWlsJykub24oJ2NsaWNrJywgdGhpcy5vbkljb25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBhJykub24oJ2NsaWNrJywgdGhpcy5vbk5hdlRhYkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnaW5wdXQuc2VhcmNoJykub24oJ2lucHV0JywgdGhpcy5vbkZpbHRlcklucHV0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLmNsb3NlJykub24oJ2NsaWNrJywgdGhpcy5vbkZpbHRlclJlc2V0Q2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgb25GaWx0ZXJSZXNldENsaWNrKGUpIHtcbiAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5wYXJlbnQoKS5maW5kKCcuc2VhcmNoJykudmFsKCcnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2lucHV0LnNlYXJjaCcpLnRyaWdnZXIoJ2lucHV0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgb25GaWx0ZXJJbnB1dChlKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hQaHJhc2UgPSAkKGUuY3VycmVudFRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICBjb25zdCAkdGFiQ29udGVudCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCcudGFiLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIC8vIHJlc2V0IGFsbCBpdGVtc1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmdyaWRpdGVtJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnaDEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcubGlzdC1ncm91cC1pdGVtJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmljb25ncmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgLy8gZmlsdGVyIGl0ZW1zXG4gICAgICAgICAgICBpZiAoc2VhcmNoUGhyYXNlKSB7XG4gICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnKltkYXRhLWljb24tbmFtZV0nKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnKltkYXRhLWljb24tYmFzZS1uYW1lKj1cIicgKyBzZWFyY2hQaHJhc2UgKyAnXCJdJykucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5jbG9zZScpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgY291bnRlclxuICAgICAgICAgICAgJCgnLmxpc3QtZ3JvdXAtaXRlbScsICR0YWJDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gJChlbCkuYXR0cignaHJlZicpLnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgICBjb25zdCBudW1iZXJPZkl0ZW1zID0gJHRhYkNvbnRlbnQuZmluZCgnaDFbaWQ9XCInICsgaWQgKyAnXCJdICsgLmljb25ncmlkIC5ncmlkaXRlbTpub3QoLmhpZGRlbiknKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICQoJ3NwYW4nLCBlbCkuaHRtbChudW1iZXJPZkl0ZW1zKTtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyT2ZJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCdoMVtpZD1cIicgKyBpZCArICdcIl0nKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJ2gxW2lkPVwiJyArIGlkICsgJ1wiXSArIC5pY29uZ3JpZCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJCgnaDE6bm90KFtpZF0pIHNwYW4nLCAkdGFiQ29udGVudCkuaHRtbCgkdGFiQ29udGVudC5maW5kKCcuZ3JpZGl0ZW06bm90KC5oaWRkZW4pJykubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBvbk5hdlRhYkNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHRhYk5hbWUgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBsaSwgLm5hdi10YWJzIGxpIGEnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcubmF2LXRhYnMgYVtocmVmPVwiIycgKyB0YWJOYW1lICsgJ1wiXScpLmFkZENsYXNzKCdhY3RpdmUnKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcudGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcudGFiLWNvbnRlbnQjJyArIHRhYk5hbWUpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBvbkljb25DbGljayhlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdhLnRodW1ibmFpbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJY29uTmFtZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5jaGlsZHJlbigpLmZpcnN0KCkuYXR0cignZGF0YS1pY29uLW5hbWUnKTtcbiAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaW5qZWN0U3R5bGVTaGVldHMoKSB7XG4gICAgICAgICAgICB0aGlzLnN0eWxlU2hlZXRzLmZvckVhY2goKHNoZWV0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFwYXJlbnQuZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbGlua1tocmVmKj1cIicgKyBzaGVldCArICdcIl0nKSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJyArIHNoZWV0ICsgJ1wiIC8+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdChwaWQsIGl0ZW1Gb3JtRWxOYW1lLCBzdHlsZVNoZWV0cykge1xuICAgICAgICAgICAgdGhpcy5waWQgPSBwaWQ7XG4gICAgICAgICAgICB0aGlzLnN0eWxlU2hlZXRzID0gc3R5bGVTaGVldHM7XG4gICAgICAgICAgICAvLyBjYWNoZSBkb21cbiAgICAgICAgICAgIHRoaXMuaXRlbUZvcm1FbE5hbWUgPSBpdGVtRm9ybUVsTmFtZTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50ID0gJCgnZGl2W2RhdGEtZm9ybS1lbGVtZW50PVwiJyArIGl0ZW1Gb3JtRWxOYW1lICsgJ1wiXScpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudCA9ICQoJ2lucHV0W25hbWU9XCInICsgaXRlbUZvcm1FbE5hbWUgKyAnXCJdJyk7XG4gICAgICAgICAgICAvLyBiaW5kIGV2ZW50c1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLnQzanMtZm9ybS1maWVsZC1pY29uc2VsZWN0aW9uJykub24oJ2NsaWNrJywgdGhpcy5vbk1vZGFsQnV0dG9uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5vbignY2xpY2snLCB0aGlzLm9uQ2xlYXJCdXR0b25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEljb25TZWxlY3Rpb24oKTtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX1RZUE8zX0NNU19CYWNrZW5kX01vZGFsX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2pxdWVyeV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9SZXNvdXJjZXMvUHJpdmF0ZS9UeXBlU2NyaXB0L0ljb25TZWxlY3Rpb24udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=