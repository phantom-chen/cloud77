import { useState } from "react";
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        // e.preventDefault();
        // setUser(email);
        // service.getToken({ email, password }).then(res => {
        //     console.log(res);
        //     setToken(res.value);
        //     setRefreshToken(res.refreshToken);
        //     navigate('/user');
        // });
    }

    return <>
        <div className="login-page">
            <div className="container">
                <a href="https://www.bing.com" target="_blank" rel="noreferrer noopener">
                    <img className="fork-me"
                        width='160px'
                        height='160px'
                        src="strip-fork-me-on-github.png"
                        alt="Fork me on GitHub"
                        data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png">
                    </img>
                </a>
                <div className="box">
                    <div className="heading"></div>
                    <form className="login-form">
                        <div className="field">
                            <input id="username" type="name" placeholder="Phone number, username, or email" value={email}
                                onChange={e => {
                                    setEmail(e.target.value);
                                }}
                                onBlur={e => {
                                    console.log(e.target.value);
                                }} />
                            <label form="username">Phone number, username, or email</label>
                        </div>
                        <div className="field">
                            <input id="password" type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
                            <label form="password">Password</label>
                        </div>
                        <button className="login-button" title="login" onClick={loginClick}>Log In</button>
                        <div className="separator">
                            <div className="line"></div>
                            <p>OR</p>
                            <div className="line"></div>
                        </div>
                        <div className="other">
                            <button className="fb-login-btn" type="button">
                                <i className="fa fa-facebook-official fb-icon"></i>
                                <span className="">Log in with Facebook</span>
                            </button>
                            <a className="forgot-password" href="#">Forgot password?</a>
                        </div>
                    </form>
                </div>
                <div className="box">
                    <p>Don't have an account? <a className="signup" href="#">Sign Up</a></p>
                    <button className="fb-login-btn" type="button">Use SSO</button>
                </div>
            </div>
        </div>
    </>
}