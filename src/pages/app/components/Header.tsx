import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGoogleAuthLogout } from "@/services/query/useGoogleDriveAuth";
import { LogOut, Menu, UserRoundCog } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutateAsync } = useGoogleAuthLogout();

  const onLogoutButtonClick = async () => {
    await mutateAsync();
    navigate("/");
  };

  const onSettingsButtonClick = () => navigate("/app/settings");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-10">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onSettingsButtonClick}>
            <UserRoundCog />
            <span>{t("header.links.settings")}</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={onSettingsButtonClick}>
            <CircleHelp />
            <span>FAQ</span>
          </DropdownMenuItem> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onLogoutButtonClick}>
            <LogOut />
            <span>{t("header.links.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
