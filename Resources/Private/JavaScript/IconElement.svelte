<svelte:options customElement={{tag: 'bw-icon-element', shadow: 'none'}} />

<script>
    import {onMount} from "svelte";
    import {iconStore, getIcon} from "./store.svelte";
    import {html} from "lit";
    import Modal from '@typo3/backend/modal.js'

    let {itemFormElName, itemFormElValue, wizardConfig, currentIconJson} = $props()
    let currentIcon = $state(null)
    let hasChange = $derived(JSON.stringify(currentIcon) !== currentIconJson.replace(/\\\//g, '/'))

    onMount(() => {
        currentIcon = currentIconJson ? JSON.parse(currentIconJson) : null
        getIcon('actions-search');
        getIcon('actions-close');
    });

    function onModalSave() {
        currentIcon = window.parent.frames.list_frame.window.SELECTED_ICON ?? null
        itemFormElValue = currentIcon ? currentIcon.value : ''
        window.parent.TYPO3.Modal.dismiss()
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
                    text: TYPO3.lang['button.cancel'],
                    trigger: () => window.parent.TYPO3.Modal.dismiss(),
                },
                {
                    btnClass: 'btn-primary',
                    name: 'save',
                    icon: 'actions-document-save',
                    text: TYPO3.lang['icon_wizard_save'],
                    trigger: onModalSave,
                },
            ],
            content: html`
                <bw-icon-wizard
                    class="w-100"
                    itemFormElName="${itemFormElName}"
                    wizardConfig="${wizardConfig}"></bw-icon-wizard>`,
            size: Modal.sizes.large,
            title: TYPO3.lang['icon_wizard_title'],
            staticBackdrop: true
        })
    }

    function onResetButtonClick(e) {
        e.preventDefault();
        currentIcon = null
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

    .form-control {
        padding: 0;
        padding-inline-end: 0;
        min-width: unset;
        background: var(--typo3-input-bg);
        transition: background-color 0.2s ease;
    }

    .white-bg {
        background: var(--bs-body-bg);
    }

    .white-bg + .close {
        color: #000 !important;
    }

    img {
        border: 0;
        box-shadow: none;
        max-height: 34px;
    }

    .fontIcon {
        font-size: 24px;
        line-height: 32px;
        color: light-dark(var(--bs-body-color), var(--typo3-input-color));
    }
</style>

<div class="input-group" class:has-change={hasChange}>
    <input type="hidden" name={itemFormElName} bind:value={itemFormElValue} />
    <div class="form-control-clearable-wrapper">
        <span class="form-control form-control-clearable input text-center" class:white-bg={currentIcon && !currentIcon.isFontIcon}>
            {#if currentIcon}
                {#if currentIcon.imgSrc}
                    <img src={currentIcon.imgSrc} alt={currentIcon.title} class="img-thumbnail" loading="lazy" />
                {:else}
                    <span class="{currentIcon.value} fontIcon"></span>
                {/if}
            {/if}
        </span>
        <button class="close" class:hidden={!currentIcon} onclick={onResetButtonClick}>
            {@html $iconStore['actions-close']}
        </button>
    </div>
    <button onclick={(e) => onButtonClick(e)} class="btn btn-default">
        {@html $iconStore['actions-search']}
        {TYPO3.lang['wizard.button']}
    </button>
</div>
