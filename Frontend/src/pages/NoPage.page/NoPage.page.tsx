import { NavLink } from "react-router-dom";
import "./NoPage.page.css";

export default function NoPage() {
  return (
    <>
      <div className="nopage">
        <div className="nopage_404">404</div>
        <div className="nopage_notfound">Страница не найдена</div>
        <NavLink to="/" className="btn_back_nopage">
          Вернуться на главную
        </NavLink>
      </div>
    </>
  );
}
