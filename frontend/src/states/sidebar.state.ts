import { create } from "zustand";

type SidebarState = {
  collapseSideBarState: {
    isCollapsed: boolean;
    isManualToggle: boolean;
  };
  activeFloatingSidebar: boolean;

  setCollapseSideBarState: (state: { isCollapsed: boolean; isManualToggle: boolean }) => void;
  setActiveFloatingSidebar: (state: boolean) => void;
  closeFloatingSidebar: () => void;
};

const useSidebarState = create<SidebarState>((set) => ({
  collapseSideBarState: { isCollapsed: false, isManualToggle: true },
  activeFloatingSidebar: false,

  setCollapseSideBarState: (state) => set({ collapseSideBarState: state }),
  setActiveFloatingSidebar: (state) => set({ activeFloatingSidebar: state }),
  closeFloatingSidebar: () => set({ activeFloatingSidebar: false }),
}));

export default useSidebarState;
