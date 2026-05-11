import { useEnigmaUI } from "@/components/enigma";
import { type MenuItem, Drawer, Button } from "@/components/ui";

interface NavbarMobileToggleProps {
  items: MenuItem[];
}

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h8m-8 6h16"
    />
  </svg>
);

const renderMenuItem = (item: MenuItem, depth = 0): React.ReactNode => {
  if (item.hidden) return null;

  const baseClass = item.active ? "bg-primary/30" : "";

  // Section title (parent with children)
  if (item.children && item.children.length > 0) {
    return (
      <div key={item.label}>
        <li>
          <a className="">{item.label}</a>
        </li>
        {item.children.map((child) => renderMenuItem(child, depth + 1))}
      </div>
    );
  }

  // Regular menu item
  return (
    <li key={item.label}>
      <a
        className={baseClass}
        onClick={(e) => {
          e.preventDefault();
          if (!item.disabled) item.onClick?.(item);
        }}
      >
        {item.icon}
        {item.label}
      </a>
    </li>
  );
};

export const NavbarMobileToggle = ({ items }: NavbarMobileToggleProps) => {
  const { openDrawer, closeDrawer } = useEnigmaUI();

  const handleOpen = () => {
    openDrawer({
      id: "menu",
      content: (
        <Drawer
          open={true}
          onClose={() => closeDrawer("menu")}
          className="px-5 py-10 w-3/4!"
          closeButton
          position="left"
        >
          <ul className="menu rounded-box bg-base-200 menu-md bg-transparent w-full p-0">
            {items.map((item) => renderMenuItem(item))}
          </ul>
        </Drawer>
      ),
    });
  };

  return (
    <Button
      onClick={handleOpen}
      size="sm"
      styleType="ghost"
      className="lg:hidden -ms-2"
    >
      <HamburgerIcon />
    </Button>
  );
};
