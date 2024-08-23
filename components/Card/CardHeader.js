import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { styled } from '@mui/system';
import styles from "assets/jss/nextjs-material-dashboard/components/cardHeaderStyle.js";

// Convert styles to styled components
const StyledCardHeader = styled('div')(({ theme }) => ({
  ...styles.cardHeader,
  '&.plain': {
    ...styles.cardHeaderPlain,
  },
  '&.icon': {
    ...styles.cardHeaderIcon,
  },
  '&.stats': {
    ...styles.cardHeaderStats,
  },
  '&.warning': {
    color: styles.warningCardHeader.color,
    ...(styles.warningCardHeader['&:not($cardHeaderIcon)'] || {}),
  },
  '&.success': {
    color: styles.successCardHeader.color,
    ...(styles.successCardHeader['&:not($cardHeaderIcon)'] || {}),
  },
  '&.danger': {
    color: styles.dangerCardHeader.color,
    ...(styles.dangerCardHeader['&:not($cardHeaderIcon)'] || {}),
  },
  '&.info': {
    color: styles.infoCardHeader.color,
    ...(styles.infoCardHeader['&:not($cardHeaderIcon)'] || {}),
  },
  '&.primary': {
    color: styles.primaryCardHeader.color,
    ...(styles.primaryCardHeader['&:not($cardHeaderIcon)'] || {}),
  },
  '&.rose': {
    color: styles.roseCardHeader.color,
    ...(styles.roseCardHeader['&:not($cardHeaderIcon)'] || {}),
  },
  '&.dark': {
    color: styles.darkCardHeader.color,
    ...(styles.darkCardHeader['&:not($cardHeaderIcon)'] || {}),
  },
}));

export default function CardHeader(props) {
  const { className, children, color, plain, stats, icon, ...rest } = props;

  const cardHeaderClasses = classNames({
    plain,
    icon,
    stats,
    [color]: color,
    [className]: className !== undefined,
  });

  return (
    <StyledCardHeader className={cardHeaderClasses} {...rest}>
      {children}
    </StyledCardHeader>
  );
}

CardHeader.propTypes = {
  className: PropTypes.string,
  color: PropTypes.oneOf([
    "warning",
    "success",
    "danger",
    "info",
    "primary",
    "rose",
    "dark",
  ]),
  plain: PropTypes.bool,
  stats: PropTypes.bool,
  icon: PropTypes.bool,
  children: PropTypes.node,
};
