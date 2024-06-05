import { useRef, useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase/client";
import Background from "../../assets/images/harrison-leece-ii6BOPjAtVY-unsplash.jpg";
import '../../assets/styles/login.css'; // This will be shared for both login and register

const Register = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const roleRef = useRef(null); // Reference for role selection
    const [errorMsg, setErrorMsg] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    let lastAttempt = 0;
    const THROTTLE_TIME = 60000; // 60 seconds

    const register = async (email, password) => {
        return await supabase.auth.signUp({
            email,
            password
        });
    };

    const updateUserRole = async (userId, role) => {
        try {
            // Get the role_id from the roles table
            const { data: rolesData, error: rolesError } = await supabase
                .from('roles')
                .select('id')
                .eq('role_name', role);

            if (rolesError) {
                console.error('Error fetching roles:', rolesError);
                throw rolesError;
            }

            if (!rolesData || rolesData.length === 0) {
                throw new Error(`Role '${role}' not found.`);
            }

            if (rolesData.length > 1) {
                throw new Error(`Multiple roles found with name '${role}'.`);
            }

            const roleId = rolesData[0].id;

            // Update the auth.users table with the role_id
            const { error } = await supabase
                .from('auth.users')
                .update({ role_id: roleId })
                .eq('id', userId);

            if (error) {
                console.error('Error updating user role:', error);
                throw error;
            }

            return null; // Success, no error
        } catch (error) {
            console.error('Error updating user role:', error.message);
            return error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const now = Date.now();
        if (now - lastAttempt < THROTTLE_TIME) {
            setErrorMsg("Please wait a moment before trying again.");
            return;
        }
        lastAttempt = now;

        // Validate email format, password strength, and role selection...

        try {
            setErrorMsg("");
            setLoading(true);
            const { data, error } = await register(emailRef.current.value, passwordRef.current.value);
            if (error) {
                if (error.message.includes("rate limit exceeded")) {
                    // Implement exponential backoff
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                    const retryResult = await register(emailRef.current.value, passwordRef.current.value);
                    if (retryResult.error) {
                        setErrorMsg("Email rate limit exceeded. Please try again later.");
                    } else {
                        const roleError = await updateUserRole(retryResult.data.user.id, roleRef.current.value);
                        if (roleError) {
                            setErrorMsg(roleError.message);
                        } else {
                            setMsg("Registration Successful. Check your email to confirm your account");
                        }
                    }
                } else {
                    setErrorMsg(error.message); // Display the error message from Supabase
                }
            } else if (data.user) {
                const roleError = await updateUserRole(data.user.id, roleRef.current.value);
                if (roleError) {
                    setErrorMsg(roleError.message); // Display the error message from Supabase
                } else {
                    setMsg("Registration Successful. Check your email to confirm your account");
                }
            }
        } catch (error) {
            setErrorMsg("Error in Creating Account");
            console.error(error); // Log the error for debugging
        }
        setLoading(false);
    };


    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePasswordStrength = (password) => {
        const minLength = 6;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumbers &&
            hasSpecialChars
        );
    };

    return (
        <div>
            <div
                className="background-image"
                style={{ backgroundImage: `url(${Background})` }}
            />
            <Card className="login-card">
                <Card.Body>
                    <h2 className="text-center mb-4 login-heading">Register</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required />
                        </Form.Group>
                        <Form.Group id="confirm-password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" ref={confirmPasswordRef} required />
                        </Form.Group>
                        <Form.Group id="role">
                            <Form.Label>Role</Form.Label>
                            <Form.Control as="select" ref={roleRef} required>
                                <option value="">Select Role</option>
                                <option value="patient">Patient</option>
                                <option value="health professional">Health Professional</option>
                            </Form.Control>
                        </Form.Group>
                        {errorMsg && (
                            <Alert
                                variant="danger"
                                onClose={() => setErrorMsg("")}
                                dismissible>
                                {errorMsg}
                            </Alert>
                        )}
                        {msg && (
                            <Alert variant="success" onClose={() => setMsg("")} dismissible>
                                {msg}
                            </Alert>
                        )}
                        <div className="text-center mt-2">
                            <Button disabled={loading} type="submit" className="w-50 btn-orange">
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </div>
                    </Form>
                    <div className="w-100 text-center mt-3">
                        Already a User? <Link to={"/login"} className="no-decoration">Login</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Register;
