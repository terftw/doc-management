import { useCallback, useState } from 'react';
import { FSEntry } from 'src/models/fsentry';

interface MenuState {
  anchorEl: HTMLElement | null;
  selectedId: string | null;
  selectedEntry: FSEntry | null;
}

export const useMenuStates = () => {
  const [menuState, setMenuState] = useState<MenuState>({
    anchorEl: null,
    selectedId: null,
    selectedEntry: null,
  });

  const handleMenuClose = useCallback(() => {
    setMenuState({
      anchorEl: null,
      selectedId: null,
      selectedEntry: null,
    });
  }, [setMenuState]);

  const handleMenuClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, entry: FSEntry) => {
      event.stopPropagation();
      setMenuState({
        anchorEl: event.currentTarget,
        selectedId: String(entry.id),
        selectedEntry: entry,
      });
    },
    [],
  );

  return {
    menuState,
    handleMenuClose,
    handleMenuClick,
  };
};
