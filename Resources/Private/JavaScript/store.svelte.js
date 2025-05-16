import {get, writable} from "svelte/store";
import Icons from '@typo3/backend/icons.js'

export const iconStore = writable({});

export const getIcon = async (iconName, size = Icons.sizes.small) => {
  const store = get(iconStore);
  if (store[iconName]) {
    return;
  }

  Icons.getIcon(iconName, size).then((html) => {
    iconStore.update((store) => {
      store[iconName] = html;
      return store
    });
  })
}
