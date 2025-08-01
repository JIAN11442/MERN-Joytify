import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";
import { IconBaseProps } from "react-icons";

import Icon, { IconName } from "./react-icons.component";
import useSidebarState from "../states/sidebar.state";

interface SidebarItemProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: { name: IconName; opts?: IconBaseProps };
  label?: string;
  href?: string;
  collapse?: boolean;
  tw?: {
    label?: string;
  };
}

const SidebarItem = forwardRef<HTMLDivElement, SidebarItemProps>(
  ({ icon, label, href, collapse, onClick, className, tw }, ref) => {
    const { name, opts } = icon;

    const navigate = useNavigate();
    const active = window.location.pathname === href;

    const { activeFloatingSidebar } = useSidebarState();

    const handleOnClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (href) {
        navigate(href);
      }

      if (onClick) {
        onClick(e);
      }
    };

    return (
      <div
        ref={ref}
        onClick={(e) => handleOnClick(e)}
        className={twMerge(
          `
          flex
          gap-x-4
          items-center
          text-neutral-400
          hover:text-white
          ${
            active &&
            `
              bg-gradient-to-r
              from-neutral-900 from-[0%]
              via-teal-400/50 via-[50%]
              to-neutral-900 to-[100%]
              text-white
            `
          }
          rounded-md
          cursor-pointer
          gradient-animation
          transition-all
        `,
          className
        )}
      >
        {/* Icon */}
        <Icon name={name} opts={{ size: 24, ...opts }} />

        {/* Label */}
        {(label?.length && !collapse) || activeFloatingSidebar ? (
          <p
            className={twMerge(
              `
                ${active ? "font-semibold" : "font-normal"}
                truncate
                `,
              tw?.label
            )}
          >
            {label}
          </p>
        ) : (
          ""
        )}
      </div>
    );
  }
);

export default SidebarItem;
