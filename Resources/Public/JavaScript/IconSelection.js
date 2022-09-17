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
        constructor(pid, itemFormElName) {
            this.pid = pid;
        }
        onModalButtonClick(e) {
            let url = TYPO3.settings.ajaxUrls.icon_selection;
            url += url.indexOf('?') > 0 ? '&' : '?';
            url += 'P[pid]=' + this.pid;
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
            stylesheets.forEach((sheet) => {
                // include if used in RTE editor
                if (this.editor) {
                    this.editor.document.$.head.insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + sheet + '" />');
                }
                // include for modal
                if (!parent.document.querySelector('link[href*="' + sheet + '"]')) {
                    parent.document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', '<link rel="stylesheet" href="' + sheet + '" />');
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
            const url = this.editor.config.tx_bwicons.routeUrl;
            Modal.advanced({
                type: Modal.types.ajax,
                content: url,
                size: Modal.sizes.large,
                title: this.editor.lang.tx_bwicons.modalTitle,
                callback: (modal) => this.currentModal = modal,
                ajaxCallback: this.onModalLoaded.bind(this),
                buttons: [
                    {
                        text: this.editor.lang.tx_bwicons.save,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2VzL1B1YmxpYy9KYXZhU2NyaXB0L0ljb25TZWxlY3Rpb24uanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsaUdBQU8sQ0FBQyxtQkFBUyxFQUFFLE9BQVMsRUFBRSwyQ0FBUSxFQUFFLDZFQUF5QixFQUFFLDZGQUFpQyxDQUFDLG1DQUFFO0FBQ3ZHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFBQSxrR0FBQzs7Ozs7Ozs7Ozs7O0FDbkxGOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvLy4vUmVzb3VyY2VzL1ByaXZhdGUvVHlwZVNjcmlwdC9JY29uU2VsZWN0aW9uLnRzIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy9leHRlcm5hbCBhbWQgXCJUWVBPMy9DTVMvQmFja2VuZC9Nb2RhbFwiIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy9leHRlcm5hbCBhbWQgXCJUWVBPMy9DTVMvQ29yZS9BamF4L0FqYXhSZXF1ZXN0XCIiLCJ3ZWJwYWNrOi8vVFlQTzMvQ01TL0J3SWNvbnMvL2V4dGVybmFsIGFtZCBcImpxdWVyeVwiIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy8vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9UWVBPMy9DTVMvQndJY29ucy8vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL1RZUE8zL0NNUy9Cd0ljb25zLy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFtcInJlcXVpcmVcIiwgXCJleHBvcnRzXCIsIFwianF1ZXJ5XCIsIFwiVFlQTzMvQ01TL0JhY2tlbmQvTW9kYWxcIiwgXCJUWVBPMy9DTVMvQ29yZS9BamF4L0FqYXhSZXF1ZXN0XCJdLCBmdW5jdGlvbiAocmVxdWlyZSwgZXhwb3J0cywgJCwgTW9kYWwsIEFqYXhSZXF1ZXN0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLyoqXG4gICAgICogTW9kdWxlOiBUWVBPMy9DTVMvQndJY29ucy9JY29uU2VsZWN0aW9uXG4gICAgICpcbiAgICAgKiBAZXhwb3J0cyBUWVBPMy9DTVMvQndJY29ucy9JY29uU2VsZWN0aW9uXG4gICAgICovXG4gICAgY2xhc3MgSWNvblNlbGVjdGlvbiB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHBpZCwgaXRlbUZvcm1FbE5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMucGlkID0gcGlkO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxCdXR0b25DbGljayhlKSB7XG4gICAgICAgICAgICBsZXQgdXJsID0gVFlQTzMuc2V0dGluZ3MuYWpheFVybHMuaWNvbl9zZWxlY3Rpb247XG4gICAgICAgICAgICB1cmwgKz0gdXJsLmluZGV4T2YoJz8nKSA+IDAgPyAnJicgOiAnPyc7XG4gICAgICAgICAgICB1cmwgKz0gJ1BbcGlkXT0nICsgdGhpcy5waWQ7XG4gICAgICAgICAgICBNb2RhbC5hZHZhbmNlZCh7XG4gICAgICAgICAgICAgICAgdHlwZTogTW9kYWwudHlwZXMuYWpheCxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB1cmwsXG4gICAgICAgICAgICAgICAgc2l6ZTogTW9kYWwuc2l6ZXMubGFyZ2UsXG4gICAgICAgICAgICAgICAgdGl0bGU6IFRZUE8zLmxhbmcuaWNvbl93aXphcmRfdGl0bGUsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChtb2RhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbCA9IG1vZGFsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWpheENhbGxiYWNrOiB0aGlzLm9uTW9kYWxMb2FkZWQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgICAgICBidXR0b25zOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFRZUE8zLmxhbmcuaWNvbl93aXphcmRfc2F2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICdzYXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246ICdhY3Rpb25zLWRvY3VtZW50LXNhdmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYnRuQ2xhc3M6ICdidG4tcHJpbWFyeScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ3NhdmUnXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogdGhpcy5vbk1vZGFsU2F2ZS5iaW5kKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBvbk1vZGFsU2F2ZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IGljb24gPSAkKHRoaXMuY3VycmVudE1vZGFsKS5maW5kKCcqW2RhdGEtaWNvbi1uYW1lPVwiJyArIHRoaXMuc2VsZWN0ZWRJY29uTmFtZSArICdcIl0nKS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudC52YWwodGhpcy5zZWxlY3RlZEljb25OYW1lKTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICQodGhpcy4kZm9ybUVsZW1lbnQpLmZpbmQoJy5pbnB1dC1pY29uLWhvbGRlcicpLmh0bWwoaWNvbik7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEljb25OYW1lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIE1vZGFsLmN1cnJlbnRNb2RhbC50cmlnZ2VyKCdtb2RhbC1kaXNtaXNzJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25DbGVhckJ1dHRvbkNsaWNrKGUpIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy5pbnB1dC1pY29uLWhvbGRlcicpLmh0bWwoJycpO1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmNsb3NlJykuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgICAgICAgICAgdGhpcy4kaGlkZGVuRWxlbWVudC52YWwoJycpO1xuICAgICAgICB9XG4gICAgICAgIG9uTW9kYWxMb2FkZWQoKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdhLnRodW1ibmFpbCcpLm9uKCdjbGljaycsIHRoaXMub25JY29uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcubmF2LXRhYnMgYScpLm9uKCdjbGljaycsIHRoaXMub25OYXZUYWJDbGljay5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJ2lucHV0LnNlYXJjaCcpLm9uKCdpbnB1dCcsIHRoaXMub25GaWx0ZXJJbnB1dC5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLmZpbmQoJy5jbG9zZScpLm9uKCdjbGljaycsIHRoaXMub25GaWx0ZXJSZXNldENsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIG9uRmlsdGVyUmVzZXRDbGljayhlKSB7XG4gICAgICAgICAgICAkKGUuY3VycmVudFRhcmdldCkucGFyZW50KCkuZmluZCgnLnNlYXJjaCcpLnZhbCgnJyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCdpbnB1dC5zZWFyY2gnKS50cmlnZ2VyKCdpbnB1dCcpO1xuICAgICAgICB9XG4gICAgICAgIG9uRmlsdGVySW5wdXQoZSkge1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoUGhyYXNlID0gJChlLmN1cnJlbnRUYXJnZXQpLnZhbCgpO1xuICAgICAgICAgICAgY29uc3QgJHRhYkNvbnRlbnQgPSAkKGUuY3VycmVudFRhcmdldCkuY2xvc2VzdCgnLnRhYi1jb250ZW50Jyk7XG4gICAgICAgICAgICAvLyByZXNldCBhbGwgaXRlbXNcbiAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5ncmlkaXRlbScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJ2gxJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnLmxpc3QtZ3JvdXAtaXRlbScpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5pY29uZ3JpZCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJy5jbG9zZScpLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICAgICAgICAgIC8vIGZpbHRlciBpdGVtc1xuICAgICAgICAgICAgaWYgKHNlYXJjaFBocmFzZSkge1xuICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJypbZGF0YS1pY29uLW5hbWVdJykucGFyZW50KCkucGFyZW50KCkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICR0YWJDb250ZW50LmZpbmQoJypbZGF0YS1pY29uLWJhc2UtbmFtZSo9XCInICsgc2VhcmNoUGhyYXNlICsgJ1wiXScpLnBhcmVudCgpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCcuY2xvc2UnKS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXBkYXRlIGNvdW50ZXJcbiAgICAgICAgICAgICQoJy5saXN0LWdyb3VwLWl0ZW0nLCAkdGFiQ29udGVudCkuZWFjaChmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9ICQoZWwpLmF0dHIoJ2hyZWYnKS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgY29uc3QgbnVtYmVyT2ZJdGVtcyA9ICR0YWJDb250ZW50LmZpbmQoJ2gxW2lkPVwiJyArIGlkICsgJ1wiXSArIC5pY29uZ3JpZCAuZ3JpZGl0ZW06bm90KC5oaWRkZW4pJykubGVuZ3RoO1xuICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICAkKCdzcGFuJywgZWwpLmh0bWwobnVtYmVyT2ZJdGVtcyk7XG4gICAgICAgICAgICAgICAgaWYgKG51bWJlck9mSXRlbXMgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJHRhYkNvbnRlbnQuZmluZCgnaDFbaWQ9XCInICsgaWQgKyAnXCJdJykuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICAgICAgICAgICAgICAgICAkdGFiQ29udGVudC5maW5kKCdoMVtpZD1cIicgKyBpZCArICdcIl0gKyAuaWNvbmdyaWQnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgICAgICAgICAgICQoZWwpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgICAgICAgICQoJ2gxOm5vdChbaWRdKSBzcGFuJywgJHRhYkNvbnRlbnQpLmh0bWwoJHRhYkNvbnRlbnQuZmluZCgnLmdyaWRpdGVtOm5vdCguaGlkZGVuKScpLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgb25OYXZUYWJDbGljayhlKSB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zdCB0YWJOYW1lID0gJChlLmN1cnJlbnRUYXJnZXQpLmF0dHIoJ2hyZWYnKS5zdWJzdHIoMSk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRNb2RhbC5maW5kKCcubmF2LXRhYnMgbGksIC5uYXYtdGFicyBsaSBhJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLm5hdi10YWJzIGFbaHJlZj1cIiMnICsgdGFiTmFtZSArICdcIl0nKS5hZGRDbGFzcygnYWN0aXZlJykucGFyZW50KCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLnRhYi1jb250ZW50JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnLnRhYi1jb250ZW50IycgKyB0YWJOYW1lKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICAgICAgb25JY29uQ2xpY2soZSkge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50TW9kYWwuZmluZCgnYS50aHVtYm5haWwnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSWNvbk5hbWUgPSAkKGUuY3VycmVudFRhcmdldCkuY2hpbGRyZW4oKS5maXJzdCgpLmF0dHIoJ2RhdGEtaWNvbi1uYW1lJyk7XG4gICAgICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB9XG4gICAgICAgIGluamVjdFN0eWxlU2hlZXRzKHN0eWxlc2hlZXRzKSB7XG4gICAgICAgICAgICBzdHlsZXNoZWV0cy5mb3JFYWNoKChzaGVldCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGluY2x1ZGUgaWYgdXNlZCBpbiBSVEUgZWRpdG9yXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmRvY3VtZW50LiQuaGVhZC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIicgKyBzaGVldCArICdcIiAvPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBpbmNsdWRlIGZvciBtb2RhbFxuICAgICAgICAgICAgICAgIGlmICghcGFyZW50LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbaHJlZio9XCInICsgc2hlZXQgKyAnXCJdJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50LmRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZWVuZCcsICc8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIicgKyBzaGVldCArICdcIiAvPicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGxvYWRBbmRJbmNsdWRlU3R5bGVzaGVldHMoKSB7XG4gICAgICAgICAgICBsZXQgdXJsID0gVFlQTzMuc2V0dGluZ3MuYWpheFVybHMuaWNvbl9zdHlsZXNoZWV0cztcbiAgICAgICAgICAgIHVybCArPSB1cmwuaW5kZXhPZignPycpID4gMCA/ICcmJyA6ICc/JztcbiAgICAgICAgICAgIHVybCArPSAncGlkPScgKyB0aGlzLnBpZDtcbiAgICAgICAgICAgIG5ldyBBamF4UmVxdWVzdCh1cmwpLmdldCgpLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmluamVjdFN0eWxlU2hlZXRzKGRhdGEpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcnRlQnV0dG9uQ2xpY2soKSB7XG4gICAgICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmVkaXRvci5jb25maWcudHhfYndpY29ucy5yb3V0ZVVybDtcbiAgICAgICAgICAgIE1vZGFsLmFkdmFuY2VkKHtcbiAgICAgICAgICAgICAgICB0eXBlOiBNb2RhbC50eXBlcy5hamF4LFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHVybCxcbiAgICAgICAgICAgICAgICBzaXplOiBNb2RhbC5zaXplcy5sYXJnZSxcbiAgICAgICAgICAgICAgICB0aXRsZTogdGhpcy5lZGl0b3IubGFuZy50eF9id2ljb25zLm1vZGFsVGl0bGUsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IChtb2RhbCkgPT4gdGhpcy5jdXJyZW50TW9kYWwgPSBtb2RhbCxcbiAgICAgICAgICAgICAgICBhamF4Q2FsbGJhY2s6IHRoaXMub25Nb2RhbExvYWRlZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICAgIGJ1dHRvbnM6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5lZGl0b3IubGFuZy50eF9id2ljb25zLnNhdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiAnc2F2ZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uOiAnYWN0aW9ucy1kb2N1bWVudC1zYXZlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ0bkNsYXNzOiAnYnRuLXByaW1hcnknLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YUF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdzYXZlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXI6IHRoaXMub25SdGVNb2RhbFNhdmUuYmluZCh0aGlzLCB0aGlzLmVkaXRvcilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIG9uUnRlTW9kYWxTYXZlKGVkaXRvcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRJY29uTmFtZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGljb24gPSAkKHRoaXMuY3VycmVudE1vZGFsKS5maW5kKCcqW2RhdGEtaWNvbi1uYW1lPVwiJyArIHRoaXMuc2VsZWN0ZWRJY29uTmFtZSArICdcIl0nKS5nZXQoMCk7XG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIGNvbnN0IGljb25FbGVtZW50ID0gbmV3IENLRURJVE9SLmRvbS5lbGVtZW50KGljb24pO1xuICAgICAgICAgICAgICAgIGVkaXRvci5pbnNlcnRFbGVtZW50KGljb25FbGVtZW50KTtcbiAgICAgICAgICAgICAgICBlZGl0b3IuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1vZGFsLnRyaWdnZXIoJ21vZGFsLWRpc21pc3MnKTtcbiAgICAgICAgfVxuICAgICAgICBpbml0Rm9yRm9ybUVsZW1lbnQoaXRlbUZvcm1FbE5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZEFuZEluY2x1ZGVTdHlsZXNoZWV0cygpO1xuICAgICAgICAgICAgLy8gY2FjaGUgZG9tXG4gICAgICAgICAgICB0aGlzLml0ZW1Gb3JtRWxOYW1lID0gaXRlbUZvcm1FbE5hbWU7XG4gICAgICAgICAgICB0aGlzLiRmb3JtRWxlbWVudCA9ICQoJ2RpdltkYXRhLWZvcm0tZWxlbWVudD1cIicgKyBpdGVtRm9ybUVsTmFtZSArICdcIl0nKTtcbiAgICAgICAgICAgIHRoaXMuJGhpZGRlbkVsZW1lbnQgPSAkKCdpbnB1dFtuYW1lPVwiJyArIGl0ZW1Gb3JtRWxOYW1lICsgJ1wiXScpO1xuICAgICAgICAgICAgLy8gYmluZCBldmVudHNcbiAgICAgICAgICAgIHRoaXMuJGZvcm1FbGVtZW50LmZpbmQoJy50M2pzLWZvcm0tZmllbGQtaWNvbnNlbGVjdGlvbicpLm9uKCdjbGljaycsIHRoaXMub25Nb2RhbEJ1dHRvbkNsaWNrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgdGhpcy4kZm9ybUVsZW1lbnQuZmluZCgnLmNsb3NlJykub24oJ2NsaWNrJywgdGhpcy5vbkNsZWFyQnV0dG9uQ2xpY2suYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgaW5pdEZvclJ0ZUVkaXRvcihlZGl0b3IpIHtcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xuICAgICAgICAgICAgdGhpcy5sb2FkQW5kSW5jbHVkZVN0eWxlc2hlZXRzKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEljb25TZWxlY3Rpb247XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9UWVBPM19DTVNfQmFja2VuZF9Nb2RhbF9fOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9UWVBPM19DTVNfQ29yZV9BamF4X0FqYXhSZXF1ZXN0X187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2pxdWVyeV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ21vZHVsZScgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9SZXNvdXJjZXMvUHJpdmF0ZS9UeXBlU2NyaXB0L0ljb25TZWxlY3Rpb24udHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=