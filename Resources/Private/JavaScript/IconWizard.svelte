<svelte:options customElement={{tag: 'bw-icon-wizard', shadow: 'none'}} />

<script>
    import {onMount} from "svelte";
    import {iconStore, getIcon} from "./store.svelte";
    import AjaxRequest from "@typo3/core/ajax/ajax-request.js";

    let {itemFormElName, itemFormElValue, wizardConfig} = $props()

    let tabs = $state([])
    let activeTab = $state(0)
    let folders = $derived(tabs[activeTab]?.folders ? Object.entries(tabs[activeTab].folders).map(([name, icons]) => {
        return [name, icons.filter(path => {
            return nameFromPath(path).toLowerCase().includes(filterQuery.toLowerCase())
        }), name]
    }) : [])
    let filterQuery = $state('')

    onMount(() => {
        getIcon('actions-close');
        getIcon('actions-filter');
        fetchIcons();
    })

    function fetchIcons() {
        const body = JSON.parse(wizardConfig)
        new AjaxRequest(TYPO3.settings.ajaxUrls.icon_selection)
            .post(body)
            .then(async function (response) {
                const resolved = await response.resolve();
                tabs = resolved.tabs;
            });
    }

    function nameFromPath(path) {
        return path.split('/').pop().split('.').slice(0, -1).join('.')
    }
</script>

<style>
    .icon-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 0.5rem;
    }
</style>

<div class="px-4 py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <ul class="nav nav-pills w-100">
            {#each tabs as tab, index}
                <li role="presentation" class="nav-item">
                    <a
                        onclick={() => activeTab = index}
                        class="nav-item nav-link"
                        class:active={activeTab === index}
                        href="#{tab.title}">{tab.title}</a>
                </li>
            {/each}
        </ul>

        <div class="form-control-clearable-wrapper">
            <div class="input-group">
                <span class="input-group-text input-group-icon">{@html $iconStore['actions-filter']}</span>
                <input
                    bind:value={filterQuery}
                    placeholder="Filter..."
                    class="form-control form-control-clearable input"
                    type="text"
                    oninput={e => {}} />
                <button class="close" onclick={() => {filterQuery = ''}}>
                    {@html $iconStore['actions-close']}
                </button>
            </div>
        </div>
    </div>

    <div class="d-flex gap-4">
        {#if folders.length > 1 }
            <div class="flex-shrink-0">
                <div class="list-group">
                    {#each folders as [name, icons]}
                        {#if icons.length > 0}
                            <a href="#tab{activeTab}-{name}" class="list-group-item d-flex justify-content-between gap-4">
                                {name}
                                <span class="badge">{icons.length}</span>
                            </a>
                        {/if}
                    {/each}
                </div>
            </div>
        {/if}

        <div class="w-100">
            {#each folders as [name, icons]}
                {#if folders.length > 1 && icons.length > 0 }
                    <h3 id="tab{activeTab}-{name}" class="pt-4 mb-4">{name}</h3>
                {/if}
                <div class="icon-grid">
                    {#each icons as path}
                        <img src="{path}" alt={nameFromPath(path)} class="img-thumbnail" />
                    {/each}
                </div>
            {/each}
        </div>

    </div>
</div>
