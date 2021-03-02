import React from "react";

const Login = (props) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    google,
    handleSignup,
    hasAccount,
    setHasAccount,
    emailError,
    passwordError,
  } = props;

    return (
      <section className="login">
        <div className="loginContainer">
          <input
            className="email-input"
            type="text"
            placeholder="email"
            autoFocus
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <p className="errorMsg">{emailError}</p>

          <input
            type="password"
            placeholder="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="errorMsg">{passwordError}</p>
          <div className="btnContainer">
            {hasAccount ? (
              <>
                <button onClick={handleLogin}>Sign in</button>
                <button onClick={google}>Sign in With Google </button>
                <p>
                  Don't have an account?
                  <span onClick={() => setHasAccount(!hasAccount)}>
                    Sign up
                  </span>
                </p>
              </>
            ) : (
              <>
                <button onClick={handleSignup}>Sign up</button>
                  <p></p>
                  
                <button className="googlebutton" onClick={google}>
                  Sign in With Google{" "}
                </button>
                <p>
                  Have an account ?
                  <span onClick={() => setHasAccount(!hasAccount)}>
                    Sign in
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    );
};

export default Login;