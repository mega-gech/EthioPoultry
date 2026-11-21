import { Menu } from "lucide-react";
import NotificationBell from "./NotificationBell";

type AdminHeaderProps = {
  pageTitle: string;
  onOpenMenu: () => void;
};

export default function AdminHeader({
  pageTitle,
  onOpenMenu,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 md:px-8">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="Open navigation menu"
          onClick={onOpenMenu}
          className="mr-3 rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <Menu size={23} />
        </button>

        <div>
          <p className="text-xs text-gray-500 sm:text-sm">Admin Workspace</p>
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            {pageTitle}
          </h2>
        </div>
      </div>

      <NotificationBell />
    </header>
  );
}
