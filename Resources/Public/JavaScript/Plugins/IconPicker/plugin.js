'use strict';

(function () {

    CKEDITOR.plugins.add('tx_bwicons', {
        lang: 'en',
        icons: 'box',
        hidpi: true,
        init: function (editor) {
            if (editor.blockless)
                return;

            console.log(editor);

            // Add command
            editor.addCommand('Icon', {
                exec: toggleBox,
                refresh: setButtonState,
                context: 'div(well)',
                allowedContent: 'div(well)',
                requiredContent: 'div(well)'
            });

            // Add Button
            editor.ui.addButton && editor.ui.addButton('tx_bwicons', {
                label: editor.lang.tx_bwicons.toolbar,
                command: 'Icon',
                toolbar: 'basicstyles',
                icon: this.path + 'icons/box.png',
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

            const pattern = /(?:\&P\[pid\]\=)\d+/gi;
            const url = decodeURIComponent(editor.config.tx_bwicons.routeUrl);
            const pid = parseInt(url.match(pattern)[0].substring(8));

            const iconPicker = new IconSelection(pid, "");
            iconPicker.rteButtonClick(editor);
        });
    }

    function setButtonState() {
        return true;
    }

})();
