import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function Login({ onAddNewUser, onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="login">
      <h1>Tenancy Management System</h1>
      {showLogin ? (
        <div>
          <p>
            Don't have an account? &nbsp;
            <button onClick={() => setShowLogin(false)}>Sign Up</button>
          </p>
          <LoginForm onLogin={onLogin} />
        </div>
      ) : (
        <div>
          <p>
            Already have an account? &nbsp;
            <button onClick={() => setShowLogin(true)}>Sign In</button>
          </p>
          <SignupForm onLogin={onLogin} onAddNewUser={onAddNewUser} />
        </div>
      )}
    </div>
  );
}

export default Login;
