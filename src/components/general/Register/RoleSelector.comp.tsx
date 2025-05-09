import style from "../../../pages/Auth.page/Register/ChooseAccount/ChooseAccount.module.css";
import "../../../pages/Auth.page/common.style.css";

type Props = {
  selected: "MANAGER" | "USER";
  setSelected: (role: "MANAGER" | "USER") => void;
};

export default function RoleSelector({ selected, setSelected }: Props) {
  return (
    <div className={style.container}>
      <label className={style.radio_container}>
        <input
          type="radio"
          name="role"
          value="MANAGER"
          checked={selected === "MANAGER"}
          onChange={() => setSelected("MANAGER")}
        />
        <span className={style.custom_radio}></span>
        Администратор
      </label>
      <label className={style.radio_container}>
        <input
          type="radio"
          name="role"
          value="USER"
          checked={selected === "USER"}
          onChange={() => setSelected("USER")}
        />
        <span className={style.custom_radio}></span>
        Пользователь
      </label>
    </div>
  );
}
