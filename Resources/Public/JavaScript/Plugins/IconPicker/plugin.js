'use strict';

(function () {

    CKEDITOR.dtd.$removeEmpty.i = 0;

    CKEDITOR.plugins.add('IconPicker', {
        lang: 'en',
        icons: 'box',
        hidpi: true,
        init: function (editor) {
            if (editor.blockless)
                return;

            // Add command
            editor.addCommand('Icon', {
                exec: toggleBox,
                refresh: setButtonState,
                context: 'div(well)',
                allowedContent: 'div(well)',
                requiredContent: 'div(well)'
            });

            // Add Button
            editor.ui.addButton && editor.ui.addButton('IconPicker', {
                label: editor.lang.IconPicker.toolbar,
                command: 'Icon',
                toolbar: 'basicstyles',
                icon: this.path + 'icons/box.png',
            });

            require([
                'TYPO3/CMS/BwIcons/IconSelection'
            ], function (IconSelection) {

                const pattern = /(?:\&P\[pid\]\=)\d+/gi;
                const url = decodeURIComponent(editor.config.IconPicker.routeUrl);
                const pid = parseInt(url.match(pattern)[0].substring(8));

                editor.iconPicker = new IconSelection(pid);
                editor.iconPicker.initForRteEditor(editor);
            });
        }
    });

    /**
     * Toggle box
     *
     * @param {Object} editor
     */
    function toggleBox(editor) {
        require([
            'TYPO3/CMS/BwIcons/IconSelection'
        ], function (IconSelection) {
            editor.iconPicker.rteButtonClick();
        });
    }

    function setButtonState() {
        return true;
    }

})();
