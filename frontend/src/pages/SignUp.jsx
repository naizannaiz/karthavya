import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FormInput } from "../components/FormInput";
import { SubmitButton } from "../components/SubmitButton";
import styles from "./SignUp.module.css";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role:""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("http://localhost:6969/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessMessage("Sign-up successful!");
        console.log("Response:", result);

        // Redirect to /login after 1 second
        setTimeout(() => navigate("/login"), 1000);
      } else {
        throw new Error(result.error || "Failed to sign up");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.signUpContainer}>
      <form className={styles.formWrapper} onSubmit={handleSubmit} noValidate>
        <h1 className={styles.title}>Sign Up</h1>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}

        <FormInput
          label="Username"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          autoComplete="username"
        />

        <FormInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        <FormInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="new-password"
        />
        <FormInput
          label="role"
          type="role"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          autoComplete="role"
        />

        <SubmitButton
          text="Register"
          backgroundImage="https://cdn.builder.io/api/v1/image/assets/TEMP/0c35efe22f1408ff2bb603ae6f3950018e7d92be6a49165c0ce4635b4425268b?placeholderIfAbsent=true&apiKey=2fc17400dcd74914b50bcc9d036de5cf"
          isLoading={isLoading}
        />
      </form>
    </main>
  );
};