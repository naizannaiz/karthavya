import React from 'react';
import styles from './SubmitButton.module.css';

export const SubmitButton = ({ text, backgroundImage, isLoading }) => {
  return (
    <button 
      type="submit" 
      className={styles.submitButton}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      <img
        loading="lazy"
        src={backgroundImage}
        className={styles.buttonBackground}
        alt=""
        aria-hidden="true"
      />
      <span className={styles.buttonText}>
        {isLoading ? 'Processing...' : text}
      </span>
    </button>
  );
};