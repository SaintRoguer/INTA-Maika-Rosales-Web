import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { styled } from '@mui/system';
import styles from "assets/jss/nextjs-material-dashboard/components/cardIconStyle.js";

// Convert styles to styled components
const StyledCardIcon = styled('div')(({ theme }) => ({
  ...styles.cardIcon,
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

export default function CardIcon(props) {
  const { className, children, color, ...rest } = props;
  const cardIconClasses = classNames({
    [color]: color,
    [className]: className !== undefined,
  });
  return (
    <StyledCardIcon className={cardIconClasses} {...rest}>
      {children}
    </StyledCardIcon>
  );
}

CardIcon.propTypes = {
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
  children: PropTypes.node,
};
