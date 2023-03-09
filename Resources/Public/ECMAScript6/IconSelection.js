import t from"jquery";import e from"@typo3/backend/modal.js";import i from"@typo3/core/ajax/ajax-request.js";class n{onModalButtonClick(t){let i=TYPO3.settings.ajaxUrls.icon_selection;i+=i.indexOf("?")>0?"&":"?",i+="P[pid]="+this.pid,i+="&P[iconProviders]="+this.iconProviders,e.advanced({type:e.types.ajax,content:i,size:e.sizes.large,title:TYPO3.lang.icon_wizard_title,callback:t=>{this.currentModal=t},ajaxCallback:this.onModalLoaded.bind(this),buttons:[{text:TYPO3.lang.icon_wizard_save,name:"save",icon:"actions-document-save",active:!0,btnClass:"btn-primary",dataAttributes:{action:"save"},trigger:this.onModalSave.bind(this)}]})}onModalSave(){const e=t(this.currentModal).find('*[data-icon-name="'+this.selectedIconName+'"]').clone();t(this.$hiddenElement).val(this.selectedIconName),t(this.$formElement).find(".input-icon-holder").html(e),this.selectedIconName&&t(this.$formElement).find(".close").css("visibility","visible"),"function"==typeof this.currentModal.hideModal?this.currentModal.hideModal():this.currentModal.trigger("modal-dismiss")}onClearButtonClick(e){t(this.$formElement).find(".input-icon-holder").html(""),t(this.$formElement).find(".close").css("visibility","hidden"),t(this.$hiddenElement).val("")}onModalLoaded(){t(this.currentModal).find("a.thumbnail").on("click",this.onIconClick.bind(this)),t(this.currentModal).find(".nav-tabs a").on("click",this.onNavTabClick.bind(this)),t(this.currentModal).find("input.search").on("input",this.onFilterInput.bind(this)),t(this.currentModal).find(".close").on("click",this.onFilterResetClick.bind(this))}onFilterResetClick(e){t(e.currentTarget).parent().find(".search").val(""),t(this.currentModal).find("input.search").trigger("input")}onFilterInput(e){const i=t(e.currentTarget).val(),n=t(e.currentTarget).closest(".tab-content");n.find(".griditem").removeClass("hidden"),n.find("h1").removeClass("hidden"),n.find(".list-group-item").removeClass("hidden"),n.find(".icongrid").removeClass("hidden"),n.find(".close").css("visibility","hidden"),i&&(n.find("*[data-icon-name]").parent().parent().addClass("hidden"),n.find('*[data-icon-base-name*="'+i+'"]').parent().parent().removeClass("hidden"),n.find(".close").css("visibility","visible")),t(".list-group-item",n).each((function(e,i){const s=t(i).attr("href").substr(1),a=n.find('h1[id="'+s+'"] + .icongrid .griditem:not(.hidden)').length;t("span",i).html(a),0===a&&(n.find('h1[id="'+s+'"]').addClass("hidden"),n.find('h1[id="'+s+'"] + .icongrid').addClass("hidden"),t(i).addClass("hidden"))})),t("h1:not([id]) span",n).html(n.find(".griditem:not(.hidden)").length)}onNavTabClick(e){e.preventDefault();const i=t(e.currentTarget).attr("href").substr(1);t(this.currentModal).find(".nav-tabs li, .nav-tabs li a").removeClass("active"),t(this.currentModal).find('.nav-tabs a[href="#'+i+'"]').addClass("active").parent().addClass("active"),t(this.currentModal).find(".tab-content").removeClass("active"),t(this.currentModal).find(".tab-content#"+i).addClass("active")}onIconClick(e){e.preventDefault(),t(this.currentModal).find("a.thumbnail").removeClass("active"),this.selectedIconName=t(e.currentTarget).children().first().attr("data-icon-name"),t(e.currentTarget).addClass("active")}injectStyleSheets(t){t.forEach((t=>{this.editor&&this.editor.document.$.head.insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="'+t+'" />'),parent.document.querySelector('link[href*="'+t+'"]')||parent.document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="'+t+'" />')}))}loadAndIncludeStylesheets(){let t=TYPO3.settings.ajaxUrls.icon_stylesheets;t+=t.indexOf("?")>0?"&":"?",t+="pid="+this.pid,new i(t).get().then((async t=>{const e=await t.resolve();this.injectStyleSheets(e)}))}rteButtonClick(){const t=this.editor.config.IconPicker.routeUrl;e.advanced({type:e.types.ajax,content:t,size:e.sizes.large,title:this.editor.lang.IconPicker.modalTitle,callback:t=>this.currentModal=t,ajaxCallback:this.onModalLoaded.bind(this),buttons:[{text:this.editor.lang.IconPicker.save,name:"save",icon:"actions-document-save",active:!0,btnClass:"btn-primary",dataAttributes:{action:"save"},trigger:this.onRteModalSave.bind(this,this.editor)}]})}onRteModalSave(e){if(this.selectedIconName){const i=t(this.currentModal).find('*[data-icon-name="'+this.selectedIconName+'"]').get(0),n=new CKEDITOR.dom.element(i);e.insertElement(n),e.focus()}this.currentModal.trigger("modal-dismiss")}initForFormElement(e){this.loadAndIncludeStylesheets(),this.itemFormElName=e,this.$formElement=t('div[data-form-element="'+e+'"]'),this.$hiddenElement=t('input[name="'+e+'"]'),t(this.$formElement).find(".t3js-form-field-iconselection").on("click",this.onModalButtonClick.bind(this)),t(this.$formElement).find(".close").on("click",this.onClearButtonClick.bind(this))}initForRteEditor(t){this.editor=t,this.loadAndIncludeStylesheets()}constructor(t,e,i){this.pid=t,this.iconProviders=e,this.initForFormElement(i)}}export{n as default};
