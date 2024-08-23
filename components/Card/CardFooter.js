import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { styled } from '@mui/system';
import styles from "assets/jss/nextjs-material-dashboard/components/cardFooterStyle.js";

// Convert styles to styled components
const StyledCardFooter = styled('div')(({ theme }) => ({
  ...styles.cardFooter,
  '&.plain': {
    ...styles.cardFooterPlain,
  },
  '&.profile': {
    ...styles.cardFooterProfile,
  },
  '&.stats': {
    ...styles.cardFooterStats,
  },
  '&.chart': {
    ...styles.cardFooterChart,
  },
}));

export default function CardFooter(props) {
  const { className, children, plain, profile, stats, chart, ...rest } = props;
  const cardFooterClasses = classNames({
    plain,
    profile,
    stats,
    chart,
    [className]: className !== undefined,
  });
  return (
    <StyledCardFooter className={cardFooterClasses} {...rest}>
      {children}
    </StyledCardFooter>
  );
}

CardFooter.propTypes = {
  className: PropTypes.string,
  plain: PropTypes.bool,
  profile: PropTypes.bool,
  stats: PropTypes.bool,
  chart: PropTypes.bool,
  children: PropTypes.node,
};
