import React from "react";
import { styled } from '@mui/material/styles';
// nodejs library to set properties for components
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

const PREFIX = 'GridContainer';

const classes = {
  grid: `${PREFIX}-grid`
};

const StyledGrid = styled(Grid)({
  [`&.${classes.grid}`]: {
    margin: "0 -15px !important",
    width: "unset",
  },
});

export default function GridContainer(props) {

  const { children, ...rest } = props;
  return (
    <StyledGrid container {...rest} className={classes.grid}>
      {children}
    </StyledGrid>
  );
}

GridContainer.propTypes = {
  children: PropTypes.node,
};
