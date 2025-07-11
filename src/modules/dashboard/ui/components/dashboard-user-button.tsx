import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export const DashboardUserButton = () => {
  const router = useRouter();

  // Retrieve session data and loading state from authentication client
  const { data, isPending } = authClient.useSession();

  // Detect if the user is on a mobile device using custom hook
  const isMobile = useIsMobile();

  /**
   * Handles user logout.
   * Signs out via authClient and redirects to sign-in page on success.
   */
  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  // While session data is loading or no user data is available, render nothing
  if (isPending || !data?.user) {
    return null;
  }

  // Render mobile version with drawer UI
  if (isMobile) {
    return (
      <Drawer>
        {/* Drawer trigger button shows avatar, user info, and dropdown icon */}
        <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
          {/* Display user avatar or generated initials avatar */}
          {data.user.image ? (
            <Avatar>
              <AvatarImage src={data.user.image} />
            </Avatar>
          ) : (
            <GeneratedAvatar
              seed={data.user.name}
              variant="initials"
              className="size-9 mr-3"
            />
          )}

          {/* User name and email */}
          <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm truncate w-full">{data.user.name}</p>
            <p className="text-xs truncate w-full">{data.user.email}</p>
          </div>

          {/* Icon indicating expandable menu */}
          <ChevronDownIcon className="size-4 shrink-0" />
        </DrawerTrigger>

        {/* Drawer content showing user details and actions */}
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{data.user.name}</DrawerTitle>
            <DrawerDescription>{data.user.email}</DrawerDescription>

            <DrawerFooter>
              {/* Billing button - action handler left empty for future implementation */}
              <Button variant="outline" onClick={() => {}}>
                <CreditCardIcon className="size-4 text-black" />
                Billing
              </Button>

              {/* Logout button triggers logout logic */}
              <Button variant="outline" onClick={onLogout}>
                <LogOutIcon className="size-4 text-black" />
                Log out
              </Button>
            </DrawerFooter>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );
  }

  // Render desktop version with dropdown menu UI
  return (
    <DropdownMenu>
      {/* Dropdown trigger shows avatar, user info, and dropdown icon */}
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden gap-x-2">
        {data.user.image ? (
          <Avatar>
            <AvatarImage src={data.user.image} />
          </Avatar>
        ) : (
          <GeneratedAvatar
            seed={data.user.name}
            variant="initials"
            className="size-9 mr-3"
          />
        )}

        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full">{data.user.name}</p>
          <p className="text-xs truncate w-full">{data.user.email}</p>
        </div>

        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>

      {/* Dropdown menu content aligned to right side */}
      <DropdownMenuContent align="end" side="right" className="w-72">
        {/* User information label */}
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        {/* Divider between label and actions */}
        <DropdownMenuSeparator />

        {/* Billing menu item (action not yet implemented) */}
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>

        {/* Logout menu item triggers logout on click */}
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between"
        >
          Log out
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
