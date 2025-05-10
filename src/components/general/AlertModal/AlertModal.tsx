import React from "react";
import style from "./AlertModal.module.css";
import { useTranslation } from "react-i18next";

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className={style.alert_modal}>
      <div className={style.alert_box}>
        <p>{message}</p>
        <div className={style.alert_buttons}>
          <button onClick={onConfirm}>{confirmText || t("alert.yes")}</button>
          <button onClick={onCancel}>{cancelText || t("alert.no")}</button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
