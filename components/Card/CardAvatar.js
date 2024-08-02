import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
import { styled } from '@mui/system';
import styles from "assets/jss/nextjs-material-dashboard/components/cardAvatarStyle.js";

// Convert styles to styled components
const StyledCardAvatar = styled('div')(({ theme }) => ({
  ...styles.cardAvatar,
  '&.plain': {
    ...styles.cardAvatarPlain,
  },
  '&.profile': {
    ...styles.cardAvatarProfile,
  },
}));

export default function CardAvatar(props) {
  const { children, className, plain, profile, ...rest } = props;
  const cardAvatarClasses = classNames({
    plain,
    profile,
    [className]: className !== undefined,
  });
  return (
    <StyledCardAvatar className={cardAvatarClasses} {...rest}>
    {children}
  </StyledCardAvatar>
  );
}

CardAvatar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  profile: PropTypes.bool,
  plain: PropTypes.bool,
};
