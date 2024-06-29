import TypingAnimation from "./TypingAnimation";
import PropTypes from "prop-types";
import { useGoogleLogin } from "@react-oauth/google";
import config from "../config.json";
import coverImage from "./coverImage.jpg";

export default function Home(props) {
  // set title of the web page
  document.title = "Quiz AI - Login";

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      props.setUser(codeResponse);
      localStorage.setItem("user", JSON.stringify(codeResponse));
    },
    onError: (error) => { },
  });

  return (
    <div className="d-flex justify-content-center my-5">
      <div className="card text-bg-dark shadow-lg" style={{ width: "35rem" }}>
        <img
          src={coverImage}
          className="card-img img-fluid"
          alt="Cover"
        />

        <div
          className="card-img-overlay d-flex align-items-start flex-column"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <h1 className="card-title">{config.name}</h1>
          <p className="card-text fs-4">
            <TypingAnimation texts={config.quotes} speed={100} />|
          </p>
          <button className="btn btn-lg btn-dark mt-auto" onClick={login}>
            <i className="fa-brands fa-google"></i> Login with Google
          </button>
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  setUser: PropTypes.func,
};
