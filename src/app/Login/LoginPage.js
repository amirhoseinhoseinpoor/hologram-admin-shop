"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { token, authReady } from "../Store/slice";
import { login, verifyAdminLoginOtp, sendAdminLoginOtp } from "../Store/thunks";
import { useRouter } from "next/navigation";
import OTPInput from "../eachPageComponent/Login/OTPComponent";
import style from "../Styles/Login/LoginStyle.module.scss";
// import captcha for the login
import ReCAPTCHA from "react-google-recaptcha";
import { Box } from "@mui/material";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const phoneNumberRegex = /^09\d{9}$/;

  const comeToken = useSelector(token);
  const isAuthReady = useSelector(authReady);

  const [username, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loadinStatus, setLodaingStatus] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isCaptchaRequired, setIsCaptchaRequired] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [otpResetKey, setOtpResetKey] = useState(0);

  const hasError = Boolean(errorMessage);

  // ReCAPTCHA Ref
  const recaptchaRef = useRef(null);
  // focuse the number filed
  const numberRef = useRef(null);
  // input ref for moving to the next
  const passwordRef = useRef(null);

  // already logged in (restored session) → skip the login form
  useEffect(() => {
    if (isAuthReady && comeToken) {
      router.replace("/AdminPanel");
    }
  }, [isAuthReady, comeToken, router]);

  useEffect(() => {
    if (numberRef.current) {
      numberRef.current.focus();
    }
    if (numberRef && username.length == 11) {
      passwordRef.current.focus();
    }
  }, [username]);

  useEffect(() => {
    if (username.length === 11 && password.length >= 4) {
      if (isCaptchaRequired) {
        setIsButtonDisabled(!captchaValue);
      } else {
        setIsButtonDisabled(false);
      }
    } else {
      setIsButtonDisabled(true);
    }
  }, [username, password, captchaValue, isCaptchaRequired]);

  useEffect(() => {
    if (failedAttempts >= 3) {
      setIsCaptchaRequired(true);
    }
  }, [failedAttempts]);

  // Send OTP to the user's phone

  const handleLogin = async (event) => {
    event.preventDefault();

    setLodaingStatus(true);
    setErrorMessage(null);

    if (isCaptchaRequired && !captchaValue) {
      setErrorMessage("لطفا ربات نیستید را تایید کنید.");
      setLodaingStatus(false);
      return;
    }

    try {
      if (!phoneNumberRegex.test(username)) {
        setErrorMessage("فرمت شماره همراه اشتباه است");
        setLodaingStatus(false);
        return;
      }

      const credentials = {
        username,
        password,
      };

      const resultAction = await dispatch(login(credentials));

      if (login.fulfilled.match(resultAction)) {
        // Password is correct and OTP has been sent
        setIsOtpSent(true);
        setLodaingStatus(false);
        return;
      }

      if (login.rejected.match(resultAction)) {
        setErrorMessage(resultAction.payload || "ورود ناموفق");
        setFailedAttempts((prev) => prev + 1);

        if (isCaptchaRequired) {
          setCaptchaValue(null);

          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
        }

        setLodaingStatus(false);
      }
    } catch (error) {
      console.error("Login/page.js", error);
      setErrorMessage("خطایی رخ داد. لطفا دوباره تلاش کنید.");
      setLodaingStatus(false);
    }
  };

  // Verify OTP

  const handleVerifyOtp = async (otp) => {
    setErrorMessage(null);
    setLodaingStatus(true);

    try {
      const resultAction = await dispatch(
        verifyAdminLoginOtp({
          username,
          otp,
        }),
      );

      if (verifyAdminLoginOtp.fulfilled.match(resultAction)) {
        router.push("/AdminPanel");
        return;
      }

      if (verifyAdminLoginOtp.rejected.match(resultAction)) {
        setErrorMessage(
          resultAction.payload || "کد تایید اشتباه یا منقضی شده است",
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setErrorMessage("خطایی در تایید کد رخ داد.");
    } finally {
      setLodaingStatus(false);
    }
  };

  // Resend OTP

  const handleResendOtp = async () => {
    setErrorMessage(null);
    const resultAction = await dispatch(
      sendAdminLoginOtp({ username, password }),
    );
    if (sendAdminLoginOtp.fulfilled.match(resultAction)) {
      setErrorMessage(null);
      setIsOtpSent(true);
      setOtpResetKey((prev) => prev + 1);
      return true;
    }
    setErrorMessage(resultAction.payload || "ارسال مجدد کد با خطا مواجه شد");
    return false;
  };

  return (
    <section className={`${style.sectionLoginStyle}  d-flex w-100`}>
      <div className={`${style.outerLoginPage} container pt-3 pb-3`}>
        <div className={`${style.LoginMainDiv} position-relative`}>
          {!isOtpSent ? (
            <form
              onSubmit={handleLogin}
              className="form-border p-2 bg-white rounded container"
            >
              <div className="d-flex flex-row justify-content-center mt-3 mb-4">
                <div>
                  <Box
                    component="img"
                    sx={{
                      width: "105px",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt="image."
                    src="/LOGO/cropped-com.chakavak.adv_512x512.png"
                  />
                </div>
              </div>
              <p className="mb-3 me-2 mt-3 discription">ورود</p>

              {errorMessage && (
                <div className={style.handelLoginError}>{errorMessage}</div>
              )}

              <div className="d-flex flex-column  mb-3">
                <label htmlFor="phoneNumber" className="mb-2 me-2 discription">
                  شماره همراه
                </label>
                <input
                  className={`${style.formInputNumber} form-control`}
                  style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                  id="phoneNumber"
                  value={username}
                  ref={numberRef}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value)) {
                      setPhoneNumber(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                  type="number"
                  inputMode="numeric"
                  required
                />
              </div>

              <div className="d-flex flex-column  mb-4">
                <label htmlFor="password" className="mb-2 me-2 discription">
                  رمز عبور
                </label>
                <input
                  type="password"
                  className={`${style.formInputNumber} form-control`}
                  style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                  id="password"
                  value={password}
                  ref={passwordRef}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[0-9]*$/.test(value)) {
                      setPassword(value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                      e.preventDefault();
                    }
                  }}
                  required
                />
              </div>

              {/* reCAPTCHA */}
              {isCaptchaRequired && (
                <div className="mb-4">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    className={style.captchaContainer}
                    sitekey="6Ld_oI4qAAAAAK1UKDgdrplzpiAbffOBTiarZ37i" // Replace with your site key
                    onChange={(value) => setCaptchaValue(value)}
                    onExpired={() => setCaptchaValue(null)}
                  />
                </div>
              )}

              <button
                type="submit"
                className={`${style.submitButton} ${
                  isButtonDisabled ? style.disabledButton : style.activeButton
                } w-100 mt-1`}
                disabled={isButtonDisabled || loadinStatus}
              >
                <div
                  className={`${style.justPaddingButton} d-flex flex-row align-items-center justify-content-center`}
                >
                  {!loadinStatus ? (
                    <>
                      <p className="ms-2 VodeoDisSizing">دریافت کد تایید</p>
                      <svg
                        width={21}
                        height={21}
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.47533 5.91748L3.41699 10.9758L8.47533 16.0341"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17.5836 10.9756H3.55859"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeMiterlimit={10}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  ) : (
                    <div className={style.loader}></div>
                  )}
                </div>
              </button>

              <div className="mt-3">
                <span className={`discription`}>ورود شما به معنای پذیرش</span>
                <span className={`${style.decoreRole}  discription`}>
                  {" "}
                  شرایط آذر هولوگرام و قوانین حریم‌خصوصی
                </span>
                <span> است.</span>
              </div>
            </form>
          ) : (
            <OTPInput
              errorMessage={errorMessage}
              username={username}
              onVerifyOtp={handleVerifyOtp}
              resendOtp={handleResendOtp}
              setIsOtpSent={setIsOtpSent}
              otpResetKey={otpResetKey}
              loading={loadinStatus}
            />
          )}
        </div>
      </div>
    </section>
  );
}
