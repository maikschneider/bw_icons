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
        }
        onFilterInput(e) {
            const searchPhrase = $(e.currentTarget).val();
            const $tabContent = $(e.currentTarget).closest('.tab-content');
            // reset all items
            $tabContent.find('.griditem').removeClass('hidden');
            $tabContent.find('h1').removeClass('hidden');
            $tabContent.find('.list-group-item').removeClass('hidden');
            $tabContent.find('.icongrid').removeClass('hidden');
            // filter items
            if (searchPhrase) {
                $tabContent.find('*[data-icon-name]').parent().parent().addClass('hidden');
                $tabContent.find('*[data-icon-base-name*="' + searchPhrase + '"]').parent().parent().removeClass('hidden');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VzL1B1YmxpYy9KYXZhU2NyaXB0L0ljb25TZWxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUdBQU8sQ0FBQyxtQkFBUyxFQUFFLE9BQVMsRUFBRSwyQ0FBUSxFQUFFLDZFQUF5QixDQUFDLG1DQUFFO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQUEsa0dBQUM7Ozs7Ozs7Ozs7OztBQ3hHRjs7Ozs7Ozs7Ozs7QUNBQTs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS8uL1Jlc291cmNlcy9Qcml2YXRlL1R5cGVTY3JpcHQvSWNvblNlbGVjdGlvbi50cyIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy9bbmFtZV0vZXh0ZXJuYWwgXCJUWVBPMy9DTVMvQmFja2VuZC9Nb2RhbFwiIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS9leHRlcm5hbCBcImpxdWVyeVwiIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy9bbmFtZV0vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy9bbmFtZV0vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zL1tuYW1lXS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFtcInJlcXVpcmVcIiwgXCJleHBvcnRzXCIsIFwianF1ZXJ5XCIsIFwiVFlQTzMvQ01TL0JhY2tlbmQvTW9kYWxcIl0sIGZ1bmN0aW9uIChyZXF1aXJlLCBleHBvcnRzLCAkLCBNb2RhbCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8qKlxuICAgICAqIE1vZHVsZTogVFlQTzMvQ01TL0J3SWNvbnMvSWNvblNlbGVjdGlvblxuICAgICAqXG4gICAgICogQGV4cG9ydHMgVFlQTzMvQ01TL0J3SWNvbnMvSWNvblNlbGVjdGlvblxuICAgICAqL1xuICAgIGNsYXNzIEljb25TZWxlY3Rpb24ge1xuICAgICAgICBvbk1vZGFsQnV0dG9uQ2xpY2soZSkge1xuICAgICAgICAgICAgTW9kYWwuYWR2YW5jZWQoe1xuICAgICAgICAgICAgICAgIHR5cGU6IE1vZGFsLnR5cGVzLmFqYXgsXG4gICAgICAgICAgICAgICAgY29udGVudDogd2luZG93LlRZUE8zLnNldHRpbmdzLmFqYXhVcmxzLmljb25fc2VsZWN0aW9uLFxuICAgICAgICAgICAgICAgIHNpemU6IE1vZGFsLnNpemVzLmxhcmdlLFxuICAgICAgICAgICAgICAgIHRpdGxlOiAnU2VsZWN0IEljb24nLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAobW9kYWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwgPSBtb2RhbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFqYXhDYWxsYmFjazogdGhpcy5vbk1vZGFsTG9hZGVkLmJpbmQodGhpcyksXG4gICAgICAgICAgICAgICAgYnV0dG9uczogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnU2F2ZSBjaGFuZ2VzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdzYXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdhY3Rpb25zLWRvY3VtZW50LXNhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnRuQ2xhc3M6ICdidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3NhdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogdGhpcy5vbk1vZGFsU2F2ZS5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBvbk1vZGFsU2F2ZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IGljb24gPSAkKHRoaXMuY3VycmVudE1vZGFsKS5maW5kKCcqW2RhdGEtaWNvbi1uYW1lPVwiJyArIHRoaXMuc2VsZWN0ZWRJY29uTmFtZSArICdcIl0nKS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudC52YWwodGhpcy5zZWxlY3RlZEljb25OYW1lKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICQodGhpcy4kZm9ybUVsZW1lbnQpLmZpbmQoJy5pbnB1dC1pY29uLWhvbGRlcicpLmh0bWwoaWNvbik7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEljb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIE1vZGFsLmN1cnJlbnRNb2RhbC50cmlnZ2VyKCdtb2RhbC1kaXNtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25DbGVhckJ1dHRvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy5pbnB1dC1pY29uLWhvbGRlcicpLmh0bWwoJycpO1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudC52YWwoJycpO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxMb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdhLnRodW1ibmFpbCcpLm9uKCdjbGljaycsIHRoaXMub25JY29uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcubmF2LXRhYnMgYScpLm9uKCdjbGljaycsIHRoaXMub25OYXZUYWJDbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2lucHV0LnNlYXJjaCcpLm9uKCdpbnB1dCcsIHRoaXMub25GaWx0ZXJJbnB1dC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBvbkZpbHRlcklucHV0KGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaFBocmFzZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS52YWwoKTtcbiAgICAgICAgICAgIGNvbnN0ICR0YWJDb250ZW50ID0gJChlLmN1cnJlbnRUYXJnZXQpLmNsb3Nlc3QoJy50YWItY29udGVudCcpO1xuICAgICAgICAgICAgLy8gcmVzZXQgYWxsIGl0ZW1zXG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcuZ3JpZGl0ZW0nKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCdoMScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5saXN0LWdyb3VwLWl0ZW0nKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcuaWNvbmdyaWQnKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAvLyBmaWx0ZXIgaXRlbXNcbiAgICAgICAgICAgIGlmIChzZWFyY2hQaHJhc2UpIHtcbiAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcqW2RhdGEtaWNvbi1uYW1lXScpLnBhcmVudCgpLnBhcmVudCgpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcqW2RhdGEtaWNvbi1iYXNlLW5hbWUqPVwiJyArIHNlYXJjaFBocmFzZSArICdcIl0nKS5wYXJlbnQoKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGUgY291bnRlclxuICAgICAgICAgICAgJCgnLmxpc3QtZ3JvdXAtaXRlbScsICR0YWJDb250ZW50KS5lYWNoKGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gJChlbCkuYXR0cignaHJlZicpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG51bWJlck9mSXRlbXMgPSAkdGFiQ29udGVudC5maW5kKCdoMScgKyBpZCArICcgKyAuaWNvbmdyaWQgLmdyaWRpdGVtOm5vdCguaGlkZGVuKScpLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgICAgICAgICAgJCgnc3BhbicsIGVsKS5odG1sKG51bWJlck9mSXRlbXMpO1xuICAgICAgICAgICAgICAgIGlmIChudW1iZXJPZkl0ZW1zID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJ2gxJyArIGlkKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJ2gxJyArIGlkICsgJyArIC5pY29uZ3JpZCcpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAgICAgJChlbCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIG9uTmF2VGFiQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3QgdGFiTmFtZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5hdHRyKCdocmVmJykuc3Vic3RyKDEpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLm5hdi10YWJzIGxpJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLm5hdi10YWJzIGFbaHJlZj1cIiMnICsgdGFiTmFtZSArICdcIl0nKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcudGFiLWNvbnRlbnQnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcudGFiLWNvbnRlbnQjJyArIHRhYk5hbWUpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgICAgICBvbkljb25DbGljayhlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdhLnRodW1ibmFpbCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJY29uTmFtZSA9ICQoZS5jdXJyZW50VGFyZ2V0KS5jaGlsZHJlbigpLmZpcnN0KCkuYXR0cignZGF0YS1pY29uLW5hbWUnKTtcbiAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdChpdGVtRm9ybUVsTmFtZSkge1xuICAgICAgICAgICAgLy8gY2FjaGUgZG9tXG4gICAgICAgICAgICB0aGlzLml0ZW1Gb3JtRWxOYW1lID0gaXRlbUZvcm1FbE5hbWU7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudCA9ICQoJ2RpdltkYXRhLWZvcm0tZWxlbWVudD1cIicgKyBpdGVtRm9ybUVsTmFtZSArICdcIl0nKTtcbiAgICAgICAgICAgIHRoaXMuJGhpZGRlbkVsZW1lbnQgPSAkKCdpbnB1dFtuYW1lPVwiJyArIGl0ZW1Gb3JtRWxOYW1lICsgJ1wiXScpO1xuICAgICAgICAgICAgLy8gYmluZCBldmVudHNcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy50M2pzLWZvcm0tZmllbGQtaWNvbnNlbGVjdGlvbicpLm9uKCdjbGljaycsIHRoaXMub25Nb2RhbEJ1dHRvbkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmNsb3NlJykub24oJ2NsaWNrJywgdGhpcy5vbkNsZWFyQnV0dG9uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJY29uU2VsZWN0aW9uKCk7XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9UWVBPM19DTVNfQmFja2VuZF9Nb2RhbF9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9qcXVlcnlfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSB1c2VkICdtb2R1bGUnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vUmVzb3VyY2VzL1ByaXZhdGUvVHlwZVNjcmlwdC9JY29uU2VsZWN0aW9uLnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9