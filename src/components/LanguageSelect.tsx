import { useTranslation } from "react-i18next";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const LanguageSelect = () => {
  const {
    t,
    i18n: { changeLanguage, language },
  } = useTranslation();

  return (
    <Select onValueChange={changeLanguage} value={language}>
      <SelectTrigger className="w-[128px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="fr">{t("common.french")}</SelectItem>
          <SelectItem value="en">{t("common.english")}</SelectItem>
          <SelectItem value="nl">{t("common.dutch")}</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
