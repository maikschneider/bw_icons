define(['TYPO3/CMS/Ckeditor5Bundle', '@blueways/bw-icons/IconSelection.js'], (function (ckeditor5Bundle_js, IconSelection) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var IconSelection__default = /*#__PURE__*/_interopDefaultLegacy(IconSelection);

    class IconPicker extends ckeditor5Bundle_js.Core.Plugin {
        init() {
            // @ts-ignore
            const editor = this.editor;
            this.registerTypo3Icon(editor);
            editor.ui.componentFactory.add(IconPicker.pluginName, locale => {
                const button = new ckeditor5Bundle_js.UI.ButtonView(locale);
                button.label = 'Icon Picker';
                // @todo introduce SVG loader
                button.icon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" fill="none"><path fill="#333" d="M29.55 1.6H9.05A7.48 7.48 0 0 0 1.6 9.05v20.5c0 4.1 3.35 7.45 7.45 7.45h20.5c4.1 0 7.45-3.35 7.45-7.45V9.05c0-4.1-3.35-7.45-7.45-7.45Zm4.1 27.95c0 2.23-1.83 4.1-4.1 4.1H9.05a4.11 4.11 0 0 1-4.1-4.1V9.05c0-2.24 1.83-4.1 4.1-4.1h20.5c2.23 0 4.1 1.83 4.1 4.1v20.5Z"/><path fill="#333" d="M16.43 13.93a3.17 3.17 0 1 0-6.33 0 3.17 3.17 0 0 0 6.33 0Z"/><path fill="#333" d="M28.47 13.93a3.17 3.17 0 1 1-6.34 0 3.17 3.17 0 0 1 6.34 0Z"/><path fill="#333" d="M23.62 21.53h-8.65c-.74 0-1.41.38-1.82 1.01-.41.6-.45 1.38-.19 2.01a6.94 6.94 0 0 0 6.3 4.14c2.72 0 5.22-1.6 6.3-4.14.3-.67.22-1.41-.19-2.01-.33-.63-1-1-1.75-1Z"/></svg>';
                button.on('execute', () => this.picker.rteButtonClick());
                return button;
            });
            this.picker = new IconSelection__default["default"](1, '', '');
            this.picker.initForRteEditor(editor);
        }
        registerTypo3Icon(editor) {
            editor.model.schema.register('typo3icon', {
                inheritAllFrom: '$inlineObject',
                allowIn: '$text',
                allowAttributes: [
                    'src',
                    'data-icon-name',
                    'data-icon-base-name',
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
                model: (viewElement, { writer }) => {
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
                view: (modelElement, { writer }) => {
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
    }
    IconPicker.pluginName = 'IconPicker';

    return IconPicker;

}));
