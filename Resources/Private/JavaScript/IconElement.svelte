<svelte:options customElement={{tag: 'bw-icon-element', shadow: 'none'}} />

<script>
    import {onMount} from "svelte";
    import {iconStore, getIcon} from "./store.svelte";
    import {html} from "lit";
    import Modal from '@typo3/backend/modal.js'

    let {itemFormElName, itemFormElValue, wizardConfig} = $props()

    onMount(() => {
        getIcon('actions-search');
        getIcon('actions-close');
    });

    function onModalSave() {
        console.log('save')
    }

    function onButtonClick(e) {
        e.preventDefault();

        const typo3Version = JSON.parse(wizardConfig).typo3Version

        Modal.advanced({
            additionalCssClasses: ['modal-bw-icon'],
            buttons: [
                {
                    btnClass: 'btn-default',
                    name: 'dismiss',
                    icon: 'actions-close',
                    text: TYPO3.lang['wizard.button.cancel'],
                    trigger: () => window.parent.TYPO3.Modal.dismiss(),
                },
                {
                    btnClass: 'btn-primary',
                    name: 'save',
                    icon: 'actions-document-save',
                    text: TYPO3.lang['wizard.button.save'],
                    trigger: onModalSave,
                },
            ],
            content: html`
                <bw-icon-wizard
                    class="w-100"
                    itemFormElName="${itemFormElName}"
                    wizardConfig="${wizardConfig}"></bw-icon-wizard>`,
            size: Modal.sizes.large,
            title: 'title',
            style: typo3Version < 13 ? Modal.styles.dark : null,
            staticBackdrop: true
        })
    }

    function onResetButtonClick(e) {
        e.preventDefault();
    }
</script>

<style>
    .input-group {
        width: 150px;
    }

    .input {
        background: none;
        border-bottom-left-radius: var(--typo3-input-border-radius) !important;
        border-top-left-radius: var(--typo3-input-border-radius) !important;
    }
</style>

<div class="input-group">
    <input type="hidden" name={itemFormElName} bind:value={itemFormElValue} />
    <div class="form-control-clearable-wrapper">
        <span class="form-control form-control-clearable input">test</span>
        <button class="close" onclick={onResetButtonClick}>
            {@html $iconStore['actions-close']}
        </button>
    </div>
    <button onclick={(e) => onButtonClick(e)} class="btn btn-default">
        {@html $iconStore['actions-search']}
        {TYPO3.lang['wizard.button']}
    </button>
</div>
