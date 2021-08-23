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
            this.currentModal.find('.nav-tabs li').removeClass('active');
            this.currentModal.find('.nav-tabs a[href="#' + tabName + '"]').parent().addClass('active');
            this.currentModal.find('.tab-content').removeClass('active');
            this.currentModal.find('.tab-content#' + tabName).addClass('active');
        }
        onIconClick(e) {
            e.preventDefault();
            this.currentModal.find('a.thumbnail').removeClass('active');
            this.selectedIconName = $(e.currentTarget).children().first().attr('data-icon-name');
            $(e.currentTarget).addClass('active');
        }
        init(pid, itemFormElName, styleSheets) {
            this.pid = pid;
            // add stylesheet to global frame (to display icons in modal)
            // @TODO: remove on close
            styleSheets.forEach((sheet) => {
                parent.document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + sheet + '" />');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VzL1B1YmxpYy9KYXZhU2NyaXB0L0ljb25TZWxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUdBQU8sQ0FBQyxtQkFBUyxFQUFFLE9BQVMsRUFBRSwyQ0FBUSxFQUFFLDZFQUF5QixDQUFDLG1DQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQSxrR0FBQzs7Ozs7Ozs7Ozs7O0FDdkhGOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdLy4vUmVzb3VyY2VzL1ByaXZhdGUvVHlwZVNjcmlwdC9JY29uU2VsZWN0aW9uLnRzIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS9leHRlcm5hbCBcIlRZUE8zL0NNUy9CYWNrZW5kL01vZGFsXCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL2V4dGVybmFsIFwianF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoW1wicmVxdWlyZVwiLCBcImV4cG9ydHNcIiwgXCJqcXVlcnlcIiwgXCJUWVBPMy9DTVMvQmFja2VuZC9Nb2RhbFwiXSwgZnVuY3Rpb24gKHJlcXVpcmUsIGV4cG9ydHMsICQsIE1vZGFsKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLyoqXG4gICAgICogTW9kdWxlOiBUWVBPMy9DTVMvQndJY29ucy9JY29uU2VsZWN0aW9uXG4gICAgICpcbiAgICAgKiBAZXhwb3J0cyBUWVBPMy9DTVMvQndJY29ucy9JY29uU2VsZWN0aW9uXG4gICAgICovXG4gICAgY2xhc3MgSWNvblNlbGVjdGlvbiB7XG4gICAgICAgIG9uTW9kYWxCdXR0b25DbGljayhlKSB7XG4gICAgICAgICAgICBNb2RhbC5hZHZhbmNlZCh7XG4gICAgICAgICAgICAgICAgdHlwZTogTW9kYWwudHlwZXMuYWpheCxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB3aW5kb3cuVFlQTzMuc2V0dGluZ3MuYWpheFVybHMuaWNvbl9zZWxlY3Rpb24gKyAnJnBpZD0nICsgdGhpcy5waWQsXG4gICAgICAgICAgICAgICAgc2l6ZTogTW9kYWwuc2l6ZXMubGFyZ2UsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QgSWNvbicsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChtb2RhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbCA9IG1vZGFsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheENhbGxiYWNrOiB0aGlzLm9uTW9kYWxMb2FkZWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdTYXZlIGNoYW5nZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2FjdGlvbnMtZG9jdW1lbnQtc2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBidG5DbGFzczogJ2J0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnc2F2ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0aGlzLm9uTW9kYWxTYXZlLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxTYXZlKCkge1xuICAgICAgICAgICAgY29uc3QgaWNvbiA9ICQodGhpcy5jdXJyZW50TW9kYWwpLmZpbmQoJypbZGF0YS1pY29uLW5hbWU9XCInICsgdGhpcy5zZWxlY3RlZEljb25OYW1lICsgJ1wiXScpLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50LnZhbCh0aGlzLnNlbGVjdGVkSWNvbk5hbWUpO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJCh0aGlzLiRmb3JtRWxlbWVudCkuZmluZCgnLmlucHV0LWljb24taG9sZGVyJykuaHRtbChpY29uKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkSWNvbk5hbWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgTW9kYWwuY3VycmVudE1vZGFsLnRyaWdnZXIoJ21vZGFsLWRpc21pc3MnKTtcbiAgICAgICAgfVxuICAgICAgICBvbkNsZWFyQnV0dG9uQ2xpY2soZSkge1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmlucHV0LWljb24taG9sZGVyJykuaHRtbCgnJyk7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50LnZhbCgnJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25Nb2RhbExvYWRlZCgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2EudGh1bWJuYWlsJykub24oJ2NsaWNrJywgdGhpcy5vbkljb25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBhJykub24oJ2NsaWNrJywgdGhpcy5vbk5hdlRhYkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnaW5wdXQuc2VhcmNoJykub24oJ2lucHV0JywgdGhpcy5vbkZpbHRlcklucHV0LmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLmNsb3NlJykub24oJ2NsaWNrJywgdGhpcy5vbkZpbHRlclJlc2V0Q2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgb25GaWx0ZXJSZXNldENsaWNrKGUpIHtcbiAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5wYXJlbnQoKS5maW5kKCcuc2VhcmNoJykudmFsKCcnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2lucHV0LnNlYXJjaCcpLnRyaWdnZXIoJ2lucHV0Jyk7XG4gICAgICAgIH1cbiAgICAgICAgb25GaWx0ZXJJbnB1dChlKSB7XG4gICAgICAgICAgICBjb25zdCBzZWFyY2hQaHJhc2UgPSAkKGUuY3VycmVudFRhcmdldCkudmFsKCk7XG4gICAgICAgICAgICBjb25zdCAkdGFiQ29udGVudCA9ICQoZS5jdXJyZW50VGFyZ2V0KS5jbG9zZXN0KCcudGFiLWNvbnRlbnQnKTtcbiAgICAgICAgICAgIC8vIHJlc2V0IGFsbCBpdGVtc1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmdyaWRpdGVtJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnaDEnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcubGlzdC1ncm91cC1pdGVtJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmljb25ncmlkJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgLy8gZmlsdGVyIGl0ZW1zXG4gICAgICAgICAgICBpZiAoc2VhcmNoUGhyYXNlKSB7XG4gICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnKltkYXRhLWljb24tbmFtZV0nKS5wYXJlbnQoKS5wYXJlbnQoKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnKltkYXRhLWljb24tYmFzZS1uYW1lKj1cIicgKyBzZWFyY2hQaHJhc2UgKyAnXCJdJykucGFyZW50KCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5jbG9zZScpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgY291bnRlclxuICAgICAgICAgICAgJCgnLmxpc3QtZ3JvdXAtaXRlbScsICR0YWJDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gJChlbCkuYXR0cignaHJlZicpLnN1YnN0cigxKTtcbiAgICAgICAgICAgICAgICBjb25zdCBudW1iZXJPZkl0ZW1zID0gJHRhYkNvbnRlbnQuZmluZCgnaDFbaWQ9XCInICsgaWQgKyAnXCJdICsgLmljb25ncmlkIC5ncmlkaXRlbTpub3QoLmhpZGRlbiknKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgICQoJ3NwYW4nLCBlbCkuaHRtbChudW1iZXJPZkl0ZW1zKTtcbiAgICAgICAgICAgICAgICBpZiAobnVtYmVyT2ZJdGVtcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCdoMVtpZD1cIicgKyBpZCArICdcIl0nKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJ2gxW2lkPVwiJyArIGlkICsgJ1wiXSArIC5pY29uZ3JpZCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJCgnaDE6bm90KFtpZF0pIHNwYW4nLCAkdGFiQ29udGVudCkuaHRtbCgkdGFiQ29udGVudC5maW5kKCcuZ3JpZGl0ZW06bm90KC5oaWRkZW4pJykubGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBvbk5hdlRhYkNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGNvbnN0IHRhYk5hbWUgPSAkKGUuY3VycmVudFRhcmdldCkuYXR0cignaHJlZicpLnN1YnN0cigxKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBsaScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBhW2hyZWY9XCIjJyArIHRhYk5hbWUgKyAnXCJdJykucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLnRhYi1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLnRhYi1jb250ZW50IycgKyB0YWJOYW1lKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25JY29uQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnYS50aHVtYm5haWwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSWNvbk5hbWUgPSAkKGUuY3VycmVudFRhcmdldCkuY2hpbGRyZW4oKS5maXJzdCgpLmF0dHIoJ2RhdGEtaWNvbi1uYW1lJyk7XG4gICAgICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGluaXQocGlkLCBpdGVtRm9ybUVsTmFtZSwgc3R5bGVTaGVldHMpIHtcbiAgICAgICAgICAgIHRoaXMucGlkID0gcGlkO1xuICAgICAgICAgICAgLy8gYWRkIHN0eWxlc2hlZXQgdG8gZ2xvYmFsIGZyYW1lICh0byBkaXNwbGF5IGljb25zIGluIG1vZGFsKVxuICAgICAgICAgICAgLy8gQFRPRE86IHJlbW92ZSBvbiBjbG9zZVxuICAgICAgICAgICAgc3R5bGVTaGVldHMuZm9yRWFjaCgoc2hlZXQpID0+IHtcbiAgICAgICAgICAgICAgICBwYXJlbnQuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlZW5kJywgJzxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiJyArIHNoZWV0ICsgJ1wiIC8+Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIGNhY2hlIGRvbVxuICAgICAgICAgICAgdGhpcy5pdGVtRm9ybUVsTmFtZSA9IGl0ZW1Gb3JtRWxOYW1lO1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQgPSAkKCdkaXZbZGF0YS1mb3JtLWVsZW1lbnQ9XCInICsgaXRlbUZvcm1FbE5hbWUgKyAnXCJdJyk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50ID0gJCgnaW5wdXRbbmFtZT1cIicgKyBpdGVtRm9ybUVsTmFtZSArICdcIl0nKTtcbiAgICAgICAgICAgIC8vIGJpbmQgZXZlbnRzXG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcudDNqcy1mb3JtLWZpZWxkLWljb25zZWxlY3Rpb24nKS5vbignY2xpY2snLCB0aGlzLm9uTW9kYWxCdXR0b25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy5jbG9zZScpLm9uKCdjbGljaycsIHRoaXMub25DbGVhckJ1dHRvbkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSWNvblNlbGVjdGlvbigpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfVFlQTzNfQ01TX0JhY2tlbmRfTW9kYWxfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfanF1ZXJ5X187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL1Jlc291cmNlcy9Qcml2YXRlL1R5cGVTY3JpcHQvSWNvblNlbGVjdGlvbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==