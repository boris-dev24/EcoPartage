import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import "../style/register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // ✅ Ensure password is at least 6 characters
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters", { position: "bottom-center" });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: fname,
          lastName: lname,
        });
      }

      toast.success("User Registered Successfully!", { position: "top-center" });

      // ✅ Redirect to login after successful registration
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);

    } catch (error) {
      console.error("Registration Error:", error.message);
      toast.error(error.message, { position: "bottom-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2 className="register-title">Create an Account</h2>
          <p className="register-subtitle">Join us today and start your journey</p>
        </div>

        {/* ✅ Fixed `onSubmit` to use only `handleRegister` */}
        <form className="register-form" onSubmit={handleRegister}>
          <div className="name-row">
            <div className="form-group">
              <label htmlFor="fname" className="form-label">First name</label>
              <input id="fname" type="text" required className="form-input" placeholder="John"
                onChange={(e) => setFname(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="lname" className="form-label">Last name</label>
              <input id="lname" type="text" className="form-input" placeholder="Doe"
                onChange={(e) => setLname(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input id="email" type="email" required className="form-input" placeholder="example@email.com"
              onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input id="password" type="password" required className="form-input" placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)} />
            <p className="password-hint">Password must be at least 6 characters</p>
          </div>

          <div className="form-action">
            <button type="submit" disabled={isLoading} className="signup-button">
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>
          </div>

          <div className="login-link-container">
            <p className="login-text">
              Already have an account? <a href="/login" className="login-link">Log in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
