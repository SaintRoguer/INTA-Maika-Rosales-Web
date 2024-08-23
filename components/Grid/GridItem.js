import React from "react";
import { styled } from '@mui/material/styles';
// nodejs library to set properties for components
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";

const PREFIX = 'GridItem';

const classes = {
  grid: `${PREFIX}-grid`
};

const StyledGrid = styled(Grid)({
  [`&.${classes.grid}`]: {
    padding: "0 15px !important",
  },
});

export default function GridItem(props) {

  const { children, ...rest } = props;
  return (
    <StyledGrid item {...rest} className={classes.grid}>
      {children}
    </StyledGrid>
  );
}

GridItem.propTypes = {
  children: PropTypes.node,
};
