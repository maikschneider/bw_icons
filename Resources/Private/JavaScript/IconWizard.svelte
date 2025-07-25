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
        window.parent.frames.list_frame.window.SELECTED_ICON = null;
        getIcon('actions-close');
        getIcon('spinner-circle', 'large');
        getIcon('actions-filter');
        fetchIcons().then(() => {
            includeStylesheets();
        })
    })

    function includeStylesheets() {
        const stylesheets = tabs.filter(tab => tab.stylesheet).map(tab => {
            return `<link rel="stylesheet" href="${tab.stylesheet}" />`
        }).join('\n')

        document.querySelector('bw-icon-wizard').insertAdjacentHTML('beforeend', stylesheets)
    }

    async function fetchIcons() {
        const body = JSON.parse(wizardConfig)
        return new AjaxRequest(TYPO3.settings.ajaxUrls.icon_selection)
            .post(body)
            .then(async function (response) {
                const resolved = await response.resolve();
                tabs = resolved.tabs;
            });
    }
</script>

<style>
    :root {
        --bw-hover-color: light-dark(var(--token-color-blue-75), var(--token-color-blue-55));
        --bw-modal-bg: light-dark(var(--token-color-neutral-3), var(--token-color-neutral-92));
    }

    .topbar {
        background: var(--bw-modal-bg, #FFF);
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .list-group {
        position: sticky;
        top: 5.25rem;
    }

    h3:first-child {
        padding-top: 0 !important;
    }

    .icon-grid {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 0.5rem;
        padding-top: 2px;
        padding-bottom: 2px;
    }

    .icon-grid-item {
        border-radius: 2px;
        padding: 2px;
        cursor: pointer;
    }

    .icon-grid-item:hover {
        box-shadow: 0 0 0 2px var(--bw-hover-color, var(--typo3-light-primary-color));
        text-decoration: none;
    }

    .icon-grid-item.active {
        cursor: pointer;
        box-shadow: 0 0 0 2px var(--bw-hover-color, var(--typo3-light-primary-color)), inset 0 0 0 2px var(--bw-hover-color, var(--typo3-light-primary-color));
        border-radius: 4px;
        transition: box-shadow 0.1s ease, border-radius 0.1s ease;
    }

    .fontIcon {
        font-size: 36px;
    }

    span.img-thumbnail {
        display: flex;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1;
        background-color: light-dark(var(--bs-body-bg), var(--typo3-modal-bg));
    }

    .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>

<div class="px-4 pb-4">
    {#if tabs && tabs.length > 0}
        <div class="d-flex justify-content-between align-items-center py-4 topbar">
            <ul class="nav nav-pills w-100">
                {#each tabs as tab, index}
                    <li role="presentation" class="nav-item">
                        <a
                            onclick={() => {activeTab = index; document.querySelector('.modal-body').scrollTop = 0}}
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
                                title="{icon.title}"
                                href="#{icon.title}"
                                class:active={selectedIcon === icon}
                                class="icon-grid-item"
                                onclick={(e) => {
                            e.preventDefault();
                            selectedIcon = icon;
                            window.parent.frames.list_frame.window.SELECTED_ICON = icon;
                        }}>
                                {#if icon.isFontIcon}
                                    <span class="img-thumbnail">
                                        <i class="{icon.value} fontIcon"></i>
                                    </span>
                                {:else}
                                    <img src={icon.imgSrc} alt={icon.title} class="img-thumbnail" loading="lazy" />
                                {/if}
                            </a>
                        {/each}
                    </div>
                {/each}
            </div>

        </div>
    {:else}
        <div class="d-flex justify-content-center align-items-center w-90 h-90 loading-spinner">
            {@html $iconStore['spinner-circle']}
        </div>
    {/if}
</div>
