import React from "react";
import "./header.css";
import light1 from "../../assets/light1.webp";
import light2 from "../../assets/light2.webp";

const Header = () => {
  return (
    <div className="header-main">
      <div className="header-sub-container">
        <div className="header-content-main-container">
          <div className="header-content-container">
            <div className="header-title-container">
              <span className="header-title">DecorShop</span>
              <span className="header-title-description">
                {" "}
                Number #1 Trusted Furniture Website
              </span>
            </div>
            <div className="header-desc-container">
              <p>Coming soon in your door with a huge discount</p>
            </div>
            <button>View Now</button>
          </div>
        </div>
        <img src={light1} className="light-img-1" alt="light1" loading="lazy" />
        <img src={light2} className="light-img-2" alt="light2" loading="lazy" />
      </div>
    </div>
  );
};

export default Header;
