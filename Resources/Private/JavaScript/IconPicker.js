import * as Core from '@ckeditor/ckeditor5-core';
import * as UI from '@ckeditor/ckeditor5-ui';
import Modal from '@typo3/backend/modal.js'
import AjaxRequest from "@typo3/core/ajax/ajax-request.js";
import {html} from "lit";

class IconPicker extends Core.Plugin {
  init() {
    const editor = this.editor;

    this.registerTypo3Icon(editor);
    this.registerTypo3FontIcon(editor);

    editor.ui.componentFactory.add(IconPicker.pluginName, locale => {
      const button = new UI.ButtonView(locale);
      button.label = 'Icon Picker';
      button.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38"><path d="M29.55 1.6H9.05A7.48 7.48 0 0 0 1.6 9.05v20.5c0 4.1 3.35 7.45 7.45 7.45h20.5c4.1 0 7.45-3.35 7.45-7.45V9.05c0-4.1-3.35-7.45-7.45-7.45Zm4.1 27.95c0 2.23-1.83 4.1-4.1 4.1H9.05a4.11 4.11 0 0 1-4.1-4.1V9.05c0-2.24 1.83-4.1 4.1-4.1h20.5c2.23 0 4.1 1.83 4.1 4.1v20.5Z"/><path d="M16.43 13.93a3.17 3.17 0 1 0-6.33 0 3.17 3.17 0 0 0 6.33 0Z"/><path d="M28.47 13.93a3.17 3.17 0 1 1-6.34 0 3.17 3.17 0 0 1 6.34 0Z"/><path d="M23.62 21.53h-8.65c-.74 0-1.41.38-1.82 1.01-.41.6-.45 1.38-.19 2.01a6.94 6.94 0 0 0 6.3 4.14c2.72 0 5.22-1.6 6.3-4.14.3-.67.22-1.41-.19-2.01-.33-.63-1-1-1.75-1Z"/></svg>';
      button.on('execute', () => this.openWizardModal());
      return button;
    });

    this.loadAndIncludeStylesheets();
  }

  guessPid() {
    const url = this.editor.config.get('typo3link')?.routeUrl
    if (url) {
      const pattern = /(?:\&P\[pid\]\=)\d+/gi;
      const decodedUrl = decodeURIComponent(url);
      return parseInt(decodedUrl.match(pattern)[0].substring(8));
    }
    return 0
  }

  onModalSave() {
    window.parent.TYPO3.Modal.dismiss()

    const selectedIcon = window.parent.frames.list_frame.window.SELECTED_ICON ?? null
    if (!selectedIcon) {
      return
    }

    if (selectedIcon.isFontIcon) {
      editor.model.change(writer => {
        const newIcon = writer.createElement('typo3fonticon', {
          class: selectedIcon.value,
          iconName: selectedIcon.title,
          iconBaseName: selectedIcon.title
        });
        editor.model.insertObject(newIcon);
      })
    } else {
      editor.model.change(writer => {
        const newIcon = writer.createElement('typo3icon', {
          src: selectedIcon.imgSrc,
          iconName: selectedIcon.title,
          iconBaseName: selectedIcon.title,
          loading: 'lazy',
          alt: selectedIcon.title,
          role: 'presentation',
        });
        editor.model.insertObject(newIcon);
      })
    }

    this.editor.focus();
  }

  getWizardConfig() {
    return {
      pid: this.guessPid(),
      iconProviders: []
    };
  }


  openWizardModal() {
    const typo3Version = 13
    const itemFormElName = 'typo3icon';
    const wizardConfig = JSON.stringify(this.getWizardConfig());

    Modal.advanced({
      additionalCssClasses: ['modal-bw-icon'],
      buttons: [
        {
          btnClass: 'btn-default',
          name: 'dismiss',
          icon: 'actions-close',
          text: window.parent.TYPO3.lang['button.cancel'],
          trigger: () => window.parent.TYPO3.Modal.dismiss(),
        },
        {
          btnClass: 'btn-primary',
          name: 'save',
          icon: 'actions-document-save',
          text: window.parent.TYPO3.lang['icon_wizard_save'],
          trigger: this.onModalSave.bind(this),
        },
      ],
      content: html`
        <bw-icon-wizard
          class="w-100" itemFormElName="${itemFormElName}" wizardConfig="${wizardConfig}" itemFormElValue=""></bw-icon-wizard>`,
      size: Modal.sizes.large,
      title: window.parent.TYPO3.lang['icon_wizard_title'],
      style: typo3Version < 13 ? Modal.styles.dark : null,
      staticBackdrop: true
    })
  }

  registerTypo3Icon(editor) {
    editor.model.schema.register('typo3icon', {
      inheritAllFrom: '$inlineObject',
      allowIn: '$text',
      allowAttributes: [
        'src',
        'iconName',
        'iconBaseName',
        'loading',
        'alt',
        'role'
      ],
    });
    editor.conversion
      .for('upcast')
      .elementToElement({
        view: {
          name: 'img',
          attributes: [
            'src',
          ]
        },
        model: (viewElement, {writer}) => {
          return writer.createElement('typo3icon', {
            src: viewElement.getAttribute('src') || '',
            iconName: viewElement.getAttribute('data-icon-name') || '',
            iconBaseName: viewElement.getAttribute('data-icon-base-name') || '',
            loading: viewElement.getAttribute('loading') || '',
            alt: viewElement.getAttribute('alt') || '',
            role: viewElement.getAttribute('role') || '',
          });
        }
      });
    editor.conversion
      .for('downcast')
      .elementToElement({
        model: {
          name: 'typo3icon',
          attributes: [
            'src'
          ]
        },
        view: (modelElement, {writer}) => {
          return writer.createEmptyElement('img', {
            'src': modelElement.getAttribute('src'),
            'data-icon-name': modelElement.getAttribute('iconName'),
            'data-icon-base-name': modelElement.getAttribute('iconBaseName'),
            'loading': modelElement.getAttribute('loading'),
            'alt': modelElement.getAttribute('alt'),
            'role': modelElement.getAttribute('role'),
          });
        },
      });
  }

  registerTypo3FontIcon(editor) {
    editor.model.schema.register('typo3fonticon', {
      inheritAllFrom: '$inlineObject',
      allowIn: '$text',
      allowAttributes: [
        'iconName',
        'iconBaseName',
        'class',
      ],
    });
    editor.conversion
      .for('upcast')
      .elementToElement({
        view: {
          name: 'i',
          classes: true
        },
        model: (viewElement, {writer}) => {
          return writer.createElement('typo3fonticon', {
            iconName: viewElement.getAttribute('data-icon-name') || '',
            iconBaseName: viewElement.getAttribute('data-icon-base-name') || '',
            class: viewElement.getAttribute('class') || '',
          });
        }
      });
    editor.conversion
      .for('downcast')
      .elementToElement({
        model: {
          name: 'typo3fonticon',
          attributes: [
            'class'
          ]
        },
        view: (modelElement, {writer}) => {
          return writer.createEmptyElement('i', {
            'data-icon-name': modelElement.getAttribute('iconName'),
            'data-icon-base-name': modelElement.getAttribute('iconBaseName'),
            'class': modelElement.getAttribute('class'),
          });
        },
      });
  }

  async loadAndIncludeStylesheets() {
    const url = TYPO3.settings.ajaxUrls.icon_stylesheets;
    const body = this.getWizardConfig()

    new AjaxRequest(url).post(body).then(async response => {
      const stylesheets = await response.resolve();

      stylesheets.forEach((sheet) => {
        document.getElementsByTagName("head")[0].insertAdjacentHTML(
          'beforeend',
          '<link rel="stylesheet" href="' + sheet + '" />');
      });
    });
  }
}

IconPicker.pluginName = 'IconPicker';

export {IconPicker as default};
