// Login.js

import { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Background from "../../assets/images/harrison-leece-ii6BOPjAtVY-unsplash.jpg";
import '../../assets/styles/login.css';

const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrorMsg("");
            setLoading(true);
            if (!passwordRef.current?.value || !emailRef.current?.value) {
                setErrorMsg("Please fill in the fields");
                return;
            }
            const {
                data: { user, session },
                error
            } = await login(emailRef.current.value, passwordRef.current.value);
            if (error) setErrorMsg(error.message);
            if (user && session) navigate("/");
        } catch (error) {
            setErrorMsg("Email or Password Incorrect");
        }
        setLoading(false);
    };

    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div>
            <div
                className="background-image"
                style={{ backgroundImage: `url(${Background})` }}
            />
            <Card className="login-card">
                <Card.Body>
                    <h2 className="text-center mb-4 login-heading">Login to GLIOMA BTDS</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password" className="password-toggle">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                ref={passwordRef}
                                required
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="password-toggle-icon"
                                onClick={toggleShowPassword}
                            />
                        </Form.Group>
                        {errorMsg && (
                            <Alert
                                variant="danger"
                                onClose={() => setErrorMsg("")}
                                dismissible
                            >
                                {errorMsg}
                            </Alert>
                        )}
                        <div className="text-center mt-4">
                            <Button
                                disabled={loading}
                                type="submit"
                                className="w-50 btn-orange"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        New User? <Link to={"/register"} className="no-decoration">Register</Link>
                    </div>
                    <div className="w-100 text-center mt-2">
                        Forgot Password? <Link to={"/passwordreset"} className="no-decoration">Click Here</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Login;
