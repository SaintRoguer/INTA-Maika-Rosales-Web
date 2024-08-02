import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { styled } from '@mui/system';
import styles from "assets/jss/nextjs-material-dashboard/components/cardStyle.js";

// Convert styles to styled components
const StyledCard = styled('div')(({ theme }) => ({
  ...styles.card,
  '&.plain': {
    ...styles.cardPlain,
  },
  '&.profile': {
    ...styles.cardProfile,
  },
  '&.chart': {
    ...styles.cardChart,
  },
}));

export default function Card(props) {
  const { className, children, plain, profile, chart, ...rest } = props;

  const cardClasses = classNames({
    plain,
    profile,
    chart,
    [className]: className !== undefined,
  });

  return (
    <StyledCard className={cardClasses} {...rest}>
      {children}
    </StyledCard>
  );
}

Card.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node,
};
