import "bootstrap/dist/css/bootstrap.min.css";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./App.css";
import app from "./firebase.init";
const auth = getAuth(app);
function App() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);
  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  };
  const handlePassBlur = (event) => {
    setPass(event.target.value);
  };
  const handleRegisteredChange = (event) => {
    setRegistered(event.target.checked);
  };
  const handleFormSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(pass)) {
      setError(
        "PassWord Should Contain One Lower,One Upper, One Number and One special charectar"
      );
      return;
    }
    setValidated(true);
    setError("");
    if (form.checkValidity() === true) {
      if (registered) {
        console.log(email, pass);
        signInWithEmailAndPassword(auth, email, pass)
          .then((result) => {
            const user = result.user;
            console.log(user);
          })
          .catch((error) => {
            console.error(error);
            setError(error);
          });
      } else {
        createUserWithEmailAndPassword(auth, email, pass)
          .then((result) => {
            const user = result.user;
            console.log(user);
            setEmail("");
            setPass("");
            verifyEmail();
            setUserName();
          })
          .catch((error) => {
            console.error(error);
            setError(error.message);
          });
      }
    }
    event.preventDefault();
  };
  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then(() => {
        console.log("updating name");
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser).then(() => {
      console.log("email verify send");
    });
  };
  const handleForgetPassword = () => {
    sendPasswordResetEmail(auth, email).then(() => {
      console.log("email sent");
    });
  };
  const handleNameBlur = (event) => {
    setName(event.target.value);
  };
  return (
    <div>
      <h2 className="text-center my-5">
        Please {registered ? "LogIn" : "Register"}
      </h2>
      <div className="w-50 mx-auto">
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
          {!registered && (
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Name</Form.Label>
              <Form.Control
                onBlur={handleNameBlur}
                type="text"
                placeholder="Enter name"
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a name.
              </Form.Control.Feedback>
            </Form.Group>
          )}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onBlur={handleEmailBlur}
              type="email"
              placeholder="Enter email"
              required
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please choose a email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              onBlur={handlePassBlur}
              type="password"
              placeholder="Password"
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              onChange={handleRegisteredChange}
              label="Already Registered?"
              feedback="You must agree before submitting."
              feedbackType="invalid"
            />
          </Form.Group>
          <h6 className="text-danger">{error}</h6>
          <Button onClick={handleForgetPassword} variant="link">
            Forget Password
          </Button>
          <br />
          <Button className="btn btn-primary" variant="primary" type="submit">
            {registered ? "LogIn" : "Regsiter"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
