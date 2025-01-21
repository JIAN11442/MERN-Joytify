import { create } from "zustand";

type LibraryState = {
  activeAddingOptions: boolean;
  activeLibrarySearchBar: boolean;
  librarySearchVal: string | null;
  playlistSearchVal: string | null;

  setActiveAddingOptions: (state: boolean) => void;
  setActiveLibrarySearchBar: (state: boolean) => void;
  setLibrarySearchVal: (val: string | null) => void;
  setPlaylistSearchVal: (val: string | null) => void;
};

const useLibraryState = create<LibraryState>((set) => ({
  activeAddingOptions: false,
  activeLibrarySearchBar: false,
  librarySearchVal: null,
  playlistSearchVal: null,

  setActiveAddingOptions: (state) => set({ activeAddingOptions: state }),
  setActiveLibrarySearchBar: (state) => set({ activeLibrarySearchBar: state }),
  setLibrarySearchVal: (val) => set({ librarySearchVal: val }),
  setPlaylistSearchVal: (val) => set({ playlistSearchVal: val }),
}));

export default useLibraryState;
