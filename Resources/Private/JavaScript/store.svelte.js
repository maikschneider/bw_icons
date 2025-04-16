import {get, writable} from "svelte/store";
import Icons from '@typo3/backend/icons.js'

export const iconStore = writable({});

export const getIcon = async (iconName) => {
  const store = get(iconStore);
  if (store[iconName]) {
    return;
  }

  Icons.getIcon(iconName, Icons.sizes.small).then((html) => {
    iconStore.update((store) => {
      store[iconName] = html;
      return store
    });
  })
}
