import style from "./Modal.module.css";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <div className={style.modal}>
      <div className={style.modal_overlay} onClick={onClose}></div>
      <div className={style.modal_content}>{children}</div>
    </div>
  );
}
