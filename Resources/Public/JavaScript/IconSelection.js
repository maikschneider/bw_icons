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
        constructor(pid, itemFormElName, styleSheets) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VzL1B1YmxpYy9KYXZhU2NyaXB0L0ljb25TZWxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUdBQU8sQ0FBQyxtQkFBUyxFQUFFLE9BQVMsRUFBRSwyQ0FBUSxFQUFFLDZFQUF5QixDQUFDLG1DQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUFBLGtHQUFDOzs7Ozs7Ozs7Ozs7QUM5SEY7Ozs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy8vLi9SZXNvdXJjZXMvUHJpdmF0ZS9UeXBlU2NyaXB0L0ljb25TZWxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvL2V4dGVybmFsIGFtZCBcIlRZUE8zL0NNUy9CYWNrZW5kL01vZGFsXCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvL2V4dGVybmFsIGFtZCBcImpxdWVyeVwiIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFtcInJlcXVpcmVcIiwgXCJleHBvcnRzXCIsIFwianF1ZXJ5XCIsIFwiVFlQTzMvQ01TL0JhY2tlbmQvTW9kYWxcIl0sIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCAkLCBNb2RhbCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8qKlxuICAgICAqIE1vZHVsZTogVFlQTzMvQ01TL0J3SWNvbnMvSWNvblNlbGVjdGlvblxuICAgICAqXG4gICAgICogQGV4cG9ydHMgVFlQTzMvQ01TL0J3SWNvbnMvSWNvblNlbGVjdGlvblxuICAgICAqL1xuICAgIGNsYXNzIEljb25TZWxlY3Rpb24ge1xuICAgICAgICBjb25zdHJ1Y3RvcihwaWQsIGl0ZW1Gb3JtRWxOYW1lLCBzdHlsZVNoZWV0cykge1xuICAgICAgICAgICAgdGhpcy5waWQgPSBwaWQ7XG4gICAgICAgICAgICB0aGlzLnN0eWxlU2hlZXRzID0gc3R5bGVTaGVldHM7XG4gICAgICAgICAgICAvLyBjYWNoZSBkb21cbiAgICAgICAgICAgIHRoaXMuaXRlbUZvcm1FbE5hbWUgPSBpdGVtRm9ybUVsTmFtZTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50ID0gJCgnZGl2W2RhdGEtZm9ybS1lbGVtZW50PVwiJyArIGl0ZW1Gb3JtRWxOYW1lICsgJ1wiXScpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudCA9ICQoJ2lucHV0W25hbWU9XCInICsgaXRlbUZvcm1FbE5hbWUgKyAnXCJdJyk7XG4gICAgICAgICAgICAvLyBiaW5kIGV2ZW50c1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLnQzanMtZm9ybS1maWVsZC1pY29uc2VsZWN0aW9uJykub24oJ2NsaWNrJywgdGhpcy5vbk1vZGFsQnV0dG9uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuY2xvc2UnKS5vbignY2xpY2snLCB0aGlzLm9uQ2xlYXJCdXR0b25DbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBvbk1vZGFsQnV0dG9uQ2xpY2soZSkge1xuICAgICAgICAgICAgdGhpcy5pbmplY3RTdHlsZVNoZWV0cygpO1xuICAgICAgICAgICAgbGV0IHVybCA9IFRZUE8zLnNldHRpbmdzLmFqYXhVcmxzLmljb25fc2VsZWN0aW9uO1xuICAgICAgICAgICAgdXJsICs9IHVybC5pbmRleE9mKCc/JykgPiAwID8gJyYnIDogJz8nO1xuICAgICAgICAgICAgdXJsICs9ICdwaWQ9JyArIHRoaXMucGlkO1xuICAgICAgICAgICAgTW9kYWwuYWR2YW5jZWQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IE1vZGFsLnR5cGVzLmFqYXgsXG4gICAgICAgICAgICAgICAgY29udGVudDogdXJsLFxuICAgICAgICAgICAgICAgIHNpemU6IE1vZGFsLnNpemVzLmxhcmdlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiBUWVBPMy5sYW5nLmljb25fd2l6YXJkX3RpdGxlLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAobW9kYWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwgPSBtb2RhbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFqYXhDYWxsYmFjazogdGhpcy5vbk1vZGFsTG9hZGVkLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBUWVBPMy5sYW5nLmljb25fd2l6YXJkX3NhdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnYWN0aW9ucy1kb2N1bWVudC1zYXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ0bkNsYXNzOiAnYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdzYXZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXI6IHRoaXMub25Nb2RhbFNhdmUuYmluZCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgb25Nb2RhbFNhdmUoKSB7XG4gICAgICAgICAgICBjb25zdCBpY29uID0gJCh0aGlzLmN1cnJlbnRNb2RhbCkuZmluZCgnKltkYXRhLWljb24tbmFtZT1cIicgKyB0aGlzLnNlbGVjdGVkSWNvbk5hbWUgKyAnXCJdJykuY2xvbmUoKTtcbiAgICAgICAgICAgIHRoaXMuJGhpZGRlbkVsZW1lbnQudmFsKHRoaXMuc2VsZWN0ZWRJY29uTmFtZSk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAkKHRoaXMuJGZvcm1FbGVtZW50KS5maW5kKCcuaW5wdXQtaWNvbi1ob2xkZXInKS5odG1sKGljb24pO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJY29uTmFtZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy5jbG9zZScpLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBNb2RhbC5jdXJyZW50TW9kYWwudHJpZ2dlcignbW9kYWwtZGlzbWlzcycpO1xuICAgICAgICB9XG4gICAgICAgIG9uQ2xlYXJCdXR0b25DbGljayhlKSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudC5maW5kKCcuaW5wdXQtaWNvbi1ob2xkZXInKS5odG1sKCcnKTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy5jbG9zZScpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIHRoaXMuJGhpZGRlbkVsZW1lbnQudmFsKCcnKTtcbiAgICAgICAgfVxuICAgICAgICBvbk1vZGFsTG9hZGVkKCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnYS50aHVtYm5haWwnKS5vbignY2xpY2snLCB0aGlzLm9uSWNvbkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLm5hdi10YWJzIGEnKS5vbignY2xpY2snLCB0aGlzLm9uTmF2VGFiQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdpbnB1dC5zZWFyY2gnKS5vbignaW5wdXQnLCB0aGlzLm9uRmlsdGVySW5wdXQuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcuY2xvc2UnKS5vbignY2xpY2snLCB0aGlzLm9uRmlsdGVyUmVzZXRDbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBvbkZpbHRlclJlc2V0Q2xpY2soZSkge1xuICAgICAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLnBhcmVudCgpLmZpbmQoJy5zZWFyY2gnKS52YWwoJycpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnaW5wdXQuc2VhcmNoJykudHJpZ2dlcignaW5wdXQnKTtcbiAgICAgICAgfVxuICAgICAgICBvbkZpbHRlcklucHV0KGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFBocmFzZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJDb250ZW50ID0gJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy50YWItY29udGVudCcpO1xuICAgICAgICAgICAgLy8gcmVzZXQgYWxsIGl0ZW1zXG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcuZ3JpZGl0ZW0nKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCdoMScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5saXN0LWdyb3VwLWl0ZW0nKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcuaWNvbmdyaWQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgICAgICAgICAvLyBmaWx0ZXIgaXRlbXNcbiAgICAgICAgICAgIGlmIChzZWFyY2hQaHJhc2UpIHtcbiAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcqW2RhdGEtaWNvbi1uYW1lXScpLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcqW2RhdGEtaWNvbi1iYXNlLW5hbWUqPVwiJyArIHNlYXJjaFBocmFzZSArICdcIl0nKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBjb3VudGVyXG4gICAgICAgICAgICAkKCcubGlzdC1ncm91cC1pdGVtJywgJHRhYkNvbnRlbnQpLmVhY2goZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgaWQgPSAkKGVsKS5hdHRyKCdocmVmJykuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bWJlck9mSXRlbXMgPSAkdGFiQ29udGVudC5maW5kKCdoMVtpZD1cIicgKyBpZCArICdcIl0gKyAuaWNvbmdyaWQgLmdyaWRpdGVtOm5vdCguaGlkZGVuKScpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgJCgnc3BhbicsIGVsKS5odG1sKG51bWJlck9mSXRlbXMpO1xuICAgICAgICAgICAgICAgIGlmIChudW1iZXJPZkl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJ2gxW2lkPVwiJyArIGlkICsgJ1wiXScpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnaDFbaWQ9XCInICsgaWQgKyAnXCJdICsgLmljb25ncmlkJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAkKCdoMTpub3QoW2lkXSkgc3BhbicsICR0YWJDb250ZW50KS5odG1sKCR0YWJDb250ZW50LmZpbmQoJy5ncmlkaXRlbTpub3QoLmhpZGRlbiknKS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIG9uTmF2VGFiQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgdGFiTmFtZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyKDEpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLm5hdi10YWJzIGxpLCAubmF2LXRhYnMgbGkgYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5uYXYtdGFicyBhW2hyZWY9XCIjJyArIHRhYk5hbWUgKyAnXCJdJykuYWRkQ2xhc3MoJ2FjdGl2ZScpLnBhcmVudCgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy50YWItY29udGVudCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy50YWItY29udGVudCMnICsgdGFiTmFtZSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIG9uSWNvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2EudGh1bWJuYWlsJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEljb25OYW1lID0gJChlLmN1cnJlbnRUYXJnZXQpLmNoaWxkcmVuKCkuZmlyc3QoKS5hdHRyKCdkYXRhLWljb24tbmFtZScpO1xuICAgICAgICAgICAgJChlLmN1cnJlbnRUYXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBpbmplY3RTdHlsZVNoZWV0cygpIHtcbiAgICAgICAgICAgIHRoaXMuc3R5bGVTaGVldHMuZm9yRWFjaCgoc2hlZXQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXBhcmVudC5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdsaW5rW2hyZWYqPVwiJyArIHNoZWV0ICsgJ1wiXScpKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCAnPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCInICsgc2hlZXQgKyAnXCIgLz4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSWNvblNlbGVjdGlvbjtcbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX1RZUE8zX0NNU19CYWNrZW5kX01vZGFsX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2pxdWVyeV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9SZXNvdXJjZXMvUHJpdmF0ZS9UeXBlU2NyaXB0L0ljb25TZWxlY3Rpb24udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=