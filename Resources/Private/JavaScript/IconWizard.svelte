<svelte:options customElement={{tag: 'bw-icon-wizard', shadow: 'none'}} />

<script>
    import {onMount} from "svelte";
    import {iconStore, getIcon} from "./store.svelte";
    import AjaxRequest from "@typo3/core/ajax/ajax-request.js";

    let {itemFormElName, itemFormElValue, wizardConfig} = $props()

    let tabs = $state([])
    let activeTab = $state(0)
    let unfilteredFolders = $derived(tabs[activeTab]?.folders ?? [])
    let folders = $derived(unfilteredFolders.map(folder => {
        return {
            ...folder,
            icons: Object.entries(folder.icons).filter(([key, icon]) => {
                return icon.title.toLowerCase().includes(filterQuery.toLowerCase())
            })
        }
    }))
    let filterQuery = $state('')
    let selectedIcon = $state(null)

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
</script>

<style>
    .icon-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 0.5rem;
    }

    .icon-grid-item {
        border-radius: 2px;
        padding: 2px;
        cursor: pointer;
    }

    .icon-grid-item:hover {
        box-shadow: 0 0 0 2px light-dark(var(--token-color-blue-75), var(--token-color-blue-55))
    }

    .icon-grid-item.active {
        cursor: pointer;
        box-shadow: 0 0 0 2px light-dark(var(--token-color-blue-75), var(--token-color-blue-55));
        background-color: light-dark(var(--token-color-blue-75), var(--token-color-blue-55));
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
                    {#each folders as folder}
                        <a href="#tab{activeTab}-{folder.title}" class="list-group-item d-flex justify-content-between gap-4">
                            {folder.title}
                            <span class="badge">{Object.entries(folder.icons).length}</span>
                        </a>
                    {/each}
                </div>
            </div>
        {/if}

        <div class="w-100">
            {#each folders as folder}
                {#if folders.length > 1 && folder.icons.length > 0}
                    <h3 id="tab{activeTab}-{folder.title}" class="pt-4 mb-4">{folder.title}</h3>
                {/if}
                <div class="icon-grid">
                    {#each folder.icons as [index, icon]}
                        <a
                            href="#{icon.title}" class:active={selectedIcon === icon} class="icon-grid-item" onclick={(e) => {
                            e.preventDefault();
                            selectedIcon = icon;
                        }}>
                            <img src={icon.imgSrc} alt={icon.title} class="img-thumbnail" loading="lazy" />
                        </a>
                    {/each}
                </div>
            {/each}
        </div>

    </div>
</div>
