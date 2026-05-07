import { Modal } from "antd";
import { Call } from "iconsax-reactjs";
import { useEffect, useRef, useState } from "react";

export default function OTPModal({
  length = 6,
  onComplete,
  open,
  duration = 180,
  cancel,
  resend,
}) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRef = useRef([]);

  // countdown
  const [countdown, setCountdown] = useState(duration);
  const [expired, setExpired] = useState(false);

  // useEffect(() => {
  //   setCountdown(duration);
  //   const timer = setInterval(() => {
  //     setCountdown((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(timer);
  //         setExpired(true);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(timer);
  // }, []);

  useEffect(() => {
    if (!open) return;

    setCountdown(duration);
    setExpired(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open, duration]);

  // format the time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last digit
    setOtp(newOtp);

    // move to the next input
    if (value && index < length - 1) {
      inputRef.current[index + 1].focus();
    }

    // if all filled -> trigger call back
    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRef.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pasteData)) return;

    const newOtp = pasteData.split("");
    setOtp(newOtp);

    newOtp.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });

    onComplete?.(newOtp.join(""));
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  // mask the phone number
  const muskPhoneNumber = (phone) => {
    if (!phone) return "";

    const firstPart = phone.slice(0, 3);
    const lastPart = phone.slice(-3);
    const maskPart = "x".repeat(phone.length - 6);

    return `${firstPart}${maskPart}${lastPart}`;
  };

  return (
    <Modal
      header={null}
      footer={null}
      className=""
      open={open}
      maskClosable={false}
      closable={true}
      onCancel={cancel}
    >
      <div className="otp-main">
        <div className="otp-title">
          <p className="t-text">Authorize Your Submission</p>
          <div className="otp-means">
            <div className="phone-div">
              <p>OTP sent to the number below</p>
              <div className="phone-number-div">
                <p>{muskPhoneNumber("0552614121")}</p>
                <Call variant="broken" className="icnax" size={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="otp-input-div" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              ref={(el) => (inputRef.current[index] = el)}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={{
                width: "40px",
                height: "50px",
                textAlign: "center",
                fontSize: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          ))}
        </div>
        <div className="expiry-div">
          <p>Code expires in {`${formatTime(countdown)}`}</p>
        </div>
        <div
          className="otp-button-div butt"
          onClick={() => onComplete?.(otp.join(""))}
        >
          <button type="submit" disabled={!isOtpComplete || expired}>
            Verify
          </button>
        </div>
        <div className="otp-options">
          <div className="otp-" onClick={cancel}>
            <a>Cancel</a>
          </div>
          <div>
            <a disabled={!expired} onClick={resend}>
              Re-Send
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
