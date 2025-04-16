<svelte:options customElement={{tag: 'bw-icon-element', shadow: 'none'}} />

<script>
    import {onMount} from "svelte";
    import {iconStore, getIcon} from "./store.svelte";

    let {itemFormElName, itemFormElValue, wizardConfig} = $props()

    onMount(() => {
        getIcon('actions-search');
        console.log('IconElement component mounted');
    });

    function onButtonClick(e) {
        e.preventDefault();
        console.log('Button clicked');
    }
</script>

<div>
    <input type="hidden" name={itemFormElName} bind:value={itemFormElValue} />
    <button onclick={(e) => onButtonClick(e)} class="btn btn-default">
        {@html $iconStore['actions-search']}
        {TYPO3.lang['wizard.button']}
    </button>
</div>
