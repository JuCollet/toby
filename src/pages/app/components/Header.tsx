import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthContext } from "@/context/AuthProvider";
import { LogOut, Menu, UserRoundCog } from "lucide-react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export const AppHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const onLogoutButtonClick = async () => {
    await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
    });
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
