import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { styled } from '@mui/system';
import styles from "assets/jss/nextjs-material-dashboard/components/cardBodyStyle.js";

// Convert styles to styled components
const StyledCardBody = styled('div')(({ theme }) => ({
  ...styles.cardBody,
  '&.plain': {
    ...styles.cardBodyPlain,
  },
  '&.profile': {
    ...styles.cardBodyProfile,
  },
}));

export default function CardBody(props) {
  const { className, children, plain, profile, ...rest } = props;
  const cardBodyClasses = classNames({
    plain,
    profile,
    [className]: className !== undefined,
  });
  return (
    <StyledCardBody className={cardBodyClasses} {...rest}>
      {children}
    </StyledCardBody>
  );
}

CardBody.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  children: PropTypes.node,
};
