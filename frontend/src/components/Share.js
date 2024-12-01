import React, { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import QRCode from "qrcode.react";

export default function Share({ url }) {
  const [copied, setCopied] = useState(false);

  const shareOnSocialMedia = (platform) => {
    const message = "Hey! Check out this quiz I created on Quiz App: ";
    let socialMediaURL = "";

    switch (platform) {
      case "whatsapp":
        socialMediaURL = isMobileDevice()
          ? `whatsapp://send?text=${encodeURIComponent(message + url)}`
          : `https://web.whatsapp.com/send?text=${encodeURIComponent(
              message + url
            )}`;
        break;
      case "facebook":
        socialMediaURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        socialMediaURL = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${message}`;
        break;
      case "linkedin":
        socialMediaURL = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          url
        )}&title=${encodeURIComponent(message)}`;
        break;
      default:
        socialMediaURL = "";
    }

    if (socialMediaURL) {
      if (platform === "whatsapp" && isMobileDevice()) {
        window.location.href = socialMediaURL; // Directly open WhatsApp on mobile
      } else {
        window.open(socialMediaURL, "_blank"); // Open in a new tab
      }
    }
  };

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  return (
    <div>
      <div className="mb-3 d-flex justify-content-center">
        <QRCode
          style={{ border: "1px solid white", padding: "2px" }}
          value={url}
        />
      </div>
      <div className="d-flex justify-content-center">
        {["whatsapp", "facebook", "twitter", "linkedin"].map(
          (platform, index) => (
            <OverlayTrigger
              key={index}
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-top`}>
                  <strong>Share on {platform}</strong>
                </Tooltip>
              }
            >
              <i
                onClick={() => shareOnSocialMedia(platform)}
                className={`fab fa-${platform} fs-1 text-light mx-3 mb-3`}
                style={{ cursor: "pointer" }}
              ></i>
            </OverlayTrigger>
          )
        )}
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          value={url}
          className="form-control"
          placeholder="Recipient's username"
          aria-label="Recipient's username"
          aria-describedby="button-addon2"
          disabled
        />
        <OverlayTrigger
          placement={"top"}
          overlay={
            <Tooltip id={`tooltip-top`}>
              <strong>{copied ? "Copied" : "Copy"}</strong>
            </Tooltip>
          }
        >
          <button
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            onClick={() => {
              navigator.clipboard.writeText(url);
              setCopied(true);
            }}
          >
            {copied ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className="far fa-clone"></i>
            )}
          </button>
        </OverlayTrigger>
      </div>
    </div>
  );
}
