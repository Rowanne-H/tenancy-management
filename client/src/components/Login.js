import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from './SignupForm';

function Login({ onAddNewUser, onLogin }) {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div>
            <h1>Tenancy Management</h1>
            {showLogin ? (
                <div>
                    <LoginForm onLogin={onLogin} />
                    <p>
                        Don't have an account? &nbsp;
                        <button onClick={() => setShowLogin(false)}>
                            Sign Up
                        </button>
                    </p>
                </div>
            ) : (
                <div>
                    <SignupForm onLogin={onLogin} onAddNewUser={onAddNewUser} />
                    <p>
                        Already have an account? &nbsp;
                        <button onClick={() => setShowLogin(true)}>
                            Sign In
                        </button>
                    </p>
                </div>
            )}
        </div>
    )
}

export default Login;