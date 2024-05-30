import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import PasswordReset from "./components/pages/PasswordReset";
import AuthRoute from "./components/AuthRoute";
import Home from "./components/pages/Home";

import UpdatePassword from './components/updatePassword';
const App = () => {
  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
          
        
        <div className="w-100" style={{ maxWidth: "400px" }}>
       
          <Routes> 
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
            </Route>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/passwordreset" element={<PasswordReset />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </div>
      </Container>
    </>
  );
};

export default App;