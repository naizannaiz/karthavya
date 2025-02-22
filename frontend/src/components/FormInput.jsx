import React from "react";
import styles from "./FormInput.module.css";

export const FormInput = ({
  label,
  type,
  icon,
  id,
  value,
  onChange,
  required = true, // Default is required
  autoComplete,
}) => {
  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={id} className={styles.inputLabel}>
        {icon && (
          <img
            loading="lazy"
            src={icon}
            className={styles.icon}
            alt=""
            aria-hidden="true"
          />
        )}
        <span>{label}</span>
      </label>
      <input
        type={type}
        id={id}
        name={id}
        className={styles.input}
        placeholder={label}
        aria-label={label}
        value={value}
        onChange={onChange}
        required={required} // Dynamically set required
        autoComplete={autoComplete}
      />
    </div>
  );
};