<svelte:options customElement={{tag: 'bw-icon-element', shadow: 'none'}} />

<script>
    import {onMount} from "svelte";
    import {iconStore, getIcon} from "./store.svelte";
    import {html} from "lit";
    import Modal from '@typo3/backend/modal.js'

    let {itemFormElName, itemFormElValue, wizardConfig, currentIconJson} = $props()
    let currentIcon = $state(null)
    let hasChange = $derived(JSON.stringify(currentIcon) !== currentIconJson.replace(/\\\//g, '/'))
    let typo3Version = $derived(JSON.parse(wizardConfig).typo3Version)
    let readOnly = $state(false)

    onMount(() => {
        readOnly = !!JSON.parse(wizardConfig).isReadOnly
        currentIcon = currentIconJson ? JSON.parse(currentIconJson) : null
        getIcon('actions-search');
        getIcon('actions-close');
        observeLanguageState()
    });

    function observeLanguageState() {
        // Extract the last field segment (e.g. tx_bwicons_icon)
        const lastBracketIndex = itemFormElName.lastIndexOf('[')
        const basePath = itemFormElName.substring(0, lastBracketIndex)
        const lastField = itemFormElName.substring(lastBracketIndex)
        // Insert [l10n_state] before the last field
        const targetName = `${basePath}[l10n_state]${lastField}`

        // Check if the checkbox exists in the parent document
        const radioCustom = document.querySelector(`input[name="${targetName}"][value="custom"]`)
        if (radioCustom) {
            radioCustom.addEventListener('change', () => {
                if (radioCustom.checked) {
                    readOnly = false
                }
            })
        }

        const radioParent = document.querySelector(`input[name="${targetName}"][value="parent"]`)
        if (radioParent) {
            readOnly = !!radioParent.checked;
            radioParent.addEventListener('change', () => {
                if (radioParent.checked) {
                    readOnly = true
                }
            })
        }
    }

    function onModalSave() {
        currentIcon = window.parent.frames.list_frame.window.SELECTED_ICON ?? null
        itemFormElValue = currentIcon ? currentIcon.value : ''
        window.parent.TYPO3.Modal.dismiss()
    }

    function onButtonClick(e) {
        e.preventDefault();

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
                    class="w-100" itemFormElName="${itemFormElName}" wizardConfig="${wizardConfig}"></bw-icon-wizard>`,
            size: Modal.sizes.large,
            title: TYPO3.lang['icon_wizard_title'],
            staticBackdrop: true
        })
    }

    function onResetButtonClick(e) {
        e.preventDefault();
        currentIcon = null
        itemFormElValue = ''
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
        border-color: var(--typo3-input-border-color);
        transition: background-color 0.2s ease;
    }

    .white-bg {
        background: var(--bs-body-bg);
    }

    .disabled-bg {
        background: var(--typo3-state-default-disabled-bg);
    }

    .disabled-border {
        border-color: color-mix(in srgb, var(--typo3-form-section-bg), var(--typo3-form-section-color) var(--typo3-border-mix));
    }

    .form-control-clearable-wrapper .white-bg + .close {
        color: #000;
    }

    img {
        border: 0;
        box-shadow: none;
        max-height: 34px;
    }

    img.readOnly {
        filter: grayscale(100%) opacity(var(--typo3-input-disabled-opacity, 0.65));
    }

    .fontIcon {
        font-size: 24px;
        line-height: 32px;
        color: light-dark(var(--bs-body-color), var(--typo3-input-color));
    }

    .fontIcon.readOnly {
        color: color-mix(in srgb,var(--typo3-form-control-disabled-color),transparent calc((1 - var(--typo3-input-disabled-opacity))*100%));
    }

    .typo3-v12 .disabled-border {
        border-color: #d2d2d2;
    }

    .typo3-v12 img {
        max-height: 30px;
    }

    .typo3-v12 .form-control {
        min-height: 32px;
    }

    .typo3-v12.has-change .form-control {
        --typo3-input-border-color: #6daae0;
    }
</style>

<div class="input-group" class:has-change={hasChange} class:typo3-v12={typo3Version === 12}>
    <input type="hidden" name={itemFormElName} bind:value={itemFormElValue} />
    <div class="form-control-clearable-wrapper">
        <span
            class="form-control form-control-clearable input text-center"
            class:white-bg={currentIcon && !currentIcon.isFontIcon}
            class:disabled-bg={readOnly && (!currentIcon || currentIcon.isFontIcon)}
            class:disabled-border={readOnly}>
            {#if currentIcon}
                {#if currentIcon.imgSrc}
                    <img src={currentIcon.imgSrc} alt={currentIcon.title} class="img-thumbnail" loading="lazy" class:readOnly={readOnly} />
                {:else}
                    <span class="{currentIcon.value} fontIcon" class:readOnly={readOnly}></span>
                {/if}
            {/if}
        </span>
        <button class="close" class:hidden={!currentIcon || readOnly} onclick={onResetButtonClick}>
            {@html $iconStore['actions-close']}
        </button>
    </div>
    <button onclick={(e) => onButtonClick(e)} class="btn btn-default" disabled={readOnly}>
        {@html $iconStore['actions-search']}
        {TYPO3.lang['wizard.button']}
    </button>
</div>
