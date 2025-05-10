import { NavLink } from "react-router-dom";
import "./NoPage.page.css";
import { useTranslation } from "react-i18next";

export default function NoPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="nopage">
        <div className="nopage_404">404</div>
        <div className="nopage_notfound">{t("nopage.notfound")}</div>
        <NavLink to="/" className="btn_back_nopage">
          {t("nopage.back")}
        </NavLink>
      </div>
    </>
  );
}
