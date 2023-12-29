import { useState, useEffect } from "react";
import { loginApi } from "../services/UserService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate(); //react-router-dom-chuyen trang
  const { loginContext } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);

  const [loadingAPI, setLoadingAPI] = useState(false);

  // useEffect(() => {
  //   let token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/");
  //   }
  // });

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }
    setLoadingAPI(true);
    let res = await loginApi(email, password);
    console.log("check res:", res);
    if (res && res.token) {
      loginContext(email, res.token);
      navigate("/");
      toast.success("Login successfully");
    } else {
      //error
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoadingAPI(false);
  };

  const handleGoBack = () => {
    navigate("/");
  };
  return (
    <>
      <div className="login-container col-12 col-sm-4">
        <div className="title">Log in</div>
        <div className="text">Email or UserName (eve.holt@reqres.in)</div>
        <input
          type="text"
          placeholder="Email or username..."
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <div className="input-2">
          <input
            type={isShowPassword ? "text" : "password"}
            placeholder="Password..."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <i
            className={
              isShowPassword === true
                ? "fa-solid fa-eye"
                : "fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          ></i>
          {/* ></i> */}
        </div>

        <button
          className={email && password ? "active" : ""}
          disabled={email && password ? false : true}
          onClick={() => handleLogin()}
        >
          {loadingAPI && <i className="fa fa-spinner fa-spin"></i>} Login
        </button>
        <div className="back">
          <i className="fa-solid fa-chevron-left pe-1"></i>
          <span onClick={() => handleGoBack()}>Go Back</span>
        </div>
      </div>
    </>
  );
};
export default Login;
