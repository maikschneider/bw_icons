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
                content: window.TYPO3.settings.ajaxUrls.icon_selection,
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
            Modal.currentModal.trigger('modal-dismiss');
        }
        onClearButtonClick(e) {
            this.$formElement.find('.input-icon-holder').html('');
            this.$hiddenElement.val('');
        }
        onModalLoaded() {
            this.currentModal.find('a.thumbnail').on('click', this.onIconClick.bind(this));
        }
        onIconClick(e) {
            e.preventDefault();
            this.currentModal.find('a.thumbnail').removeClass('active');
            this.selectedIconName = $(e.currentTarget).children().first().attr('data-icon-name');
            $(e.currentTarget).addClass('active');
        }
        init(itemFormElName) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VzL1B1YmxpYy9KYXZhU2NyaXB0L0ljb25TZWxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUdBQU8sQ0FBQyxtQkFBUyxFQUFFLE9BQVMsRUFBRSwyQ0FBUSxFQUFFLDZFQUF5QixDQUFDLG1DQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQSxrR0FBQzs7Ozs7Ozs7Ozs7O0FDaEVGOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdLy4vUmVzb3VyY2VzL1ByaXZhdGUvVHlwZVNjcmlwdC9JY29uU2VsZWN0aW9uLnRzIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS9leHRlcm5hbCBcIlRZUE8zL0NNUy9CYWNrZW5kL01vZGFsXCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL2V4dGVybmFsIFwianF1ZXJ5XCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvW25hbWVdL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoW1wicmVxdWlyZVwiLCBcImV4cG9ydHNcIiwgXCJqcXVlcnlcIiwgXCJUWVBPMy9DTVMvQmFja2VuZC9Nb2RhbFwiXSwgZnVuY3Rpb24gKHJlcXVpcmUsIGV4cG9ydHMsICQsIE1vZGFsKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLyoqXG4gICAgICogTW9kdWxlOiBUWVBPMy9DTVMvQndJY29ucy9JY29uU2VsZWN0aW9uXG4gICAgICpcbiAgICAgKiBAZXhwb3J0cyBUWVBPMy9DTVMvQndJY29ucy9JY29uU2VsZWN0aW9uXG4gICAgICovXG4gICAgY2xhc3MgSWNvblNlbGVjdGlvbiB7XG4gICAgICAgIG9uTW9kYWxCdXR0b25DbGljayhlKSB7XG4gICAgICAgICAgICBNb2RhbC5hZHZhbmNlZCh7XG4gICAgICAgICAgICAgICAgdHlwZTogTW9kYWwudHlwZXMuYWpheCxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB3aW5kb3cuVFlQTzMuc2V0dGluZ3MuYWpheFVybHMuaWNvbl9zZWxlY3Rpb24sXG4gICAgICAgICAgICAgICAgc2l6ZTogTW9kYWwuc2l6ZXMubGFyZ2UsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdTZWxlY3QgSWNvbicsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChtb2RhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbCA9IG1vZGFsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheENhbGxiYWNrOiB0aGlzLm9uTW9kYWxMb2FkZWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdTYXZlIGNoYW5nZXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ3NhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2FjdGlvbnMtZG9jdW1lbnQtc2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBidG5DbGFzczogJ2J0bi1wcmltYXJ5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiAnc2F2ZSdcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0aGlzLm9uTW9kYWxTYXZlLmJpbmQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxTYXZlKCkge1xuICAgICAgICAgICAgY29uc3QgaWNvbiA9ICQodGhpcy5jdXJyZW50TW9kYWwpLmZpbmQoJypbZGF0YS1pY29uLW5hbWU9XCInICsgdGhpcy5zZWxlY3RlZEljb25OYW1lICsgJ1wiXScpLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50LnZhbCh0aGlzLnNlbGVjdGVkSWNvbk5hbWUpO1xuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgJCh0aGlzLiRmb3JtRWxlbWVudCkuZmluZCgnLmlucHV0LWljb24taG9sZGVyJykuaHRtbChpY29uKTtcbiAgICAgICAgICAgIE1vZGFsLmN1cnJlbnRNb2RhbC50cmlnZ2VyKCdtb2RhbC1kaXNtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25DbGVhckJ1dHRvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy5pbnB1dC1pY29uLWhvbGRlcicpLmh0bWwoJycpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudC52YWwoJycpO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxMb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdhLnRodW1ibmFpbCcpLm9uKCdjbGljaycsIHRoaXMub25JY29uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgb25JY29uQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnYS50aHVtYm5haWwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSWNvbk5hbWUgPSAkKGUuY3VycmVudFRhcmdldCkuY2hpbGRyZW4oKS5maXJzdCgpLmF0dHIoJ2RhdGEtaWNvbi1uYW1lJyk7XG4gICAgICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGluaXQoaXRlbUZvcm1FbE5hbWUpIHtcbiAgICAgICAgICAgIC8vIGNhY2hlIGRvbVxuICAgICAgICAgICAgdGhpcy5pdGVtRm9ybUVsTmFtZSA9IGl0ZW1Gb3JtRWxOYW1lO1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQgPSAkKCdkaXZbZGF0YS1mb3JtLWVsZW1lbnQ9XCInICsgaXRlbUZvcm1FbE5hbWUgKyAnXCJdJyk7XG4gICAgICAgICAgICB0aGlzLiRoaWRkZW5FbGVtZW50ID0gJCgnaW5wdXRbbmFtZT1cIicgKyBpdGVtRm9ybUVsTmFtZSArICdcIl0nKTtcbiAgICAgICAgICAgIC8vIGJpbmQgZXZlbnRzXG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcudDNqcy1mb3JtLWZpZWxkLWljb25zZWxlY3Rpb24nKS5vbignY2xpY2snLCB0aGlzLm9uTW9kYWxCdXR0b25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy5jbG9zZScpLm9uKCdjbGljaycsIHRoaXMub25DbGVhckJ1dHRvbkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgSWNvblNlbGVjdGlvbigpO1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfVFlQTzNfQ01TX0JhY2tlbmRfTW9kYWxfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfanF1ZXJ5X187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgdXNlZCAnbW9kdWxlJyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL1Jlc291cmNlcy9Qcml2YXRlL1R5cGVTY3JpcHQvSWNvblNlbGVjdGlvbi50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==