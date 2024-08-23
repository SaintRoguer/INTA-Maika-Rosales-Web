import React from "react";

import { styled } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";

// core components
import { infoColor, title } from "assets/jss/nextjs-material-dashboard.js";

const PREFIX = 'PageChange';

const classes = {
  progress: `${PREFIX}-progress`,
  wrapperDiv: `${PREFIX}-wrapperDiv`,
  iconWrapper: `${PREFIX}-iconWrapper`,
  title: `${PREFIX}-title`
};

const Root = styled('div')({
  [`& .${classes.progress}`]: {
    color: infoColor,
    width: "6rem !important",
    height: "6rem !important",
  },
  [`& .${classes.wrapperDiv}`]: {
    margin: "100px auto",
    padding: "0px",
    maxWidth: "360px",
    textAlign: "center",
    position: "relative",
    zIndex: "9999",
    top: "0",
  },
  [`& .${classes.iconWrapper}`]: {
    display: "block",
  },
  [`& .${classes.title}`]: {
    ...title,
    color: "#FFFFFF",
  },
});

export default function PageChange(props) {

  return (
    <Root>
      <div className={classes.wrapperDiv}>
        <div className={classes.iconWrapper}>
          <CircularProgress className={classes.progress} />
        </div>
        {props.showText ? <h4 className={classes.title}>Cargando...</h4> : ""}
      </div>
    </Root>
  );
}
