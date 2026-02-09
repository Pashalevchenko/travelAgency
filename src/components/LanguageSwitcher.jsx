import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLang = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <div>
      <button onClick={() => changeLang("en")}>EN</button>
      <button onClick={() => changeLang("ua")}>UA</button>
    </div>
  );
}