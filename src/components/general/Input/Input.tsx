import React, { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
  minLength?: number;
  error?: string;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  maxLength = 30,
  minLength = 2,
  error,
  label,
  className,
  ...props
}) => {
  return (
    <div className={styles.inputWrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={`${styles.input} ${error ? styles.error : ""} ${className || ""}`}
        maxLength={maxLength}
        minLength={minLength}
        {...props}
      />
      {error && (
        <div className={styles.helperText}>
          <span className={styles.errorText}>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
