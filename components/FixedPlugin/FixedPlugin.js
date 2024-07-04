/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

import Button from "components/CustomButtons/Button.js";
import { FeedbackFish } from "@feedback-fish/react";

export default function FixedPlugin(props) {
  const handleClick = () => {
    props.handleFixedClick();
  };
  return (
    <div className={classnames("fixed-plugin")}>
      <div id="fixedPluginClasses" className={props.fixedClasses}>
        <div onClick={handleClick}>
          <i className="fa fa-cog fa-2x" />
        </div>
        <ul className="dropdown-menu">
          <li className="header-title">Otras opciones</li>
          <li className="button-container">
            <div className="button-container">
              <Button
                color="success"
                href="https://drive.google.com/file/d/1R1gTdAKPZS6O2zv4WeTZM3sDXDmmssq3/view?usp=sharing"
                target="_blank"
                fullWidth
              >
                Descargar app Android
              </Button>
            </div>
          </li>
          <li className="button-container">
            <div className="button-container">
              <FeedbackFish projectId="af88f33ebb78ee" />

              <Button data-feedback-fish color="warning" fullWidth>
                Dar feedback
              </Button>
            </div>
          </li>
          {/* <li className="button-container">
            <Button
              color="info"
              fullWidth
              href="https://www.creative-tim.com/learning-lab/nextjs/overview/material-dashboard?ref=njsmd-fixed-plugin"
              target="_blank"
            >
              Ver Demo Youtube
            </Button>
          </li> */}

          <li className="adjustments-line" />
        </ul>
      </div>
    </div>
  );
}

FixedPlugin.propTypes = {
  bgImage: PropTypes.object,
  handleFixedClick: PropTypes.func,
  fixedClasses: PropTypes.string,
  bgColor: PropTypes.oneOf([
    "white",
    "purple",
    "blue",
    "green",
    "orange",
    "red",
  ]),
  handleColorClick: PropTypes.func,
  handleImageClick: PropTypes.func,
};
