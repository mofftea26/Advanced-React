import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Home, Search, User, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import Link from "./ui/Link";
export default function Navigation() {
  const { currentUser } = useCurrentUser();
  const navLinkClassName =
    "rounded-lg p-2 text-lg hover:bg-neutral-100 dark:hover:bg-neutral-800";
  const activeLinkClassName = "bg-neutral-100 dark:bg-neutral-800";
  return (
    <nav className="flex w-64 flex-col gap-4 pt-8">
      <Link
        to="/"
        className={navLinkClassName}
        variant="ghost"
        activeProps={{ className: activeLinkClassName }}
      >
        <Home className="h-6 w-6" />
        Home
      </Link>
      <Link
        to="/search"
        variant="ghost"
        className={navLinkClassName}
        activeProps={{ className: activeLinkClassName }}
      >
        <Search className="h-6 w-6" />
        Search
      </Link>
      {currentUser && (
        <Link
          to="/users/$userId"
          variant="ghost"
          params={{ userId: currentUser.id }}
          className={navLinkClassName}
          activeProps={{ className: activeLinkClassName }}
        >
          <User className="h-6 w-6" />
          Profile
        </Link>
      )}
      {currentUser ? (
        <Link
          to="/settings"
          variant="ghost"
          className={navLinkClassName}
          activeProps={{ className: activeLinkClassName }}
        >
          <Settings className="h-6 w-6" />
          Settings
        </Link>
      ) : (
        <Link
          to="/login"
          variant="ghost"
          className={navLinkClassName}
          activeProps={{ className: activeLinkClassName }}
        >
          <User className="h-6 w-6" />
          Sign In
        </Link>
      )}
      <ThemeToggle />
    </nav>
  );
}
