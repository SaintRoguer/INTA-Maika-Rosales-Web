// components/ActiveLink.js
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledLink = styled('a')(({ theme, isActive, id }) => ({
  ...(id === 'brand' && {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 16px',
    textDecoration: 'none',
    color: isActive ? theme.palette.primary.main : theme.palette.text.primary,
    fontSize: '16px',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    backgroundColor: isActive ? theme.palette.action.selected : 'transparent',
    cursor: 'pointer',
    }),
}));

const ActiveLink = ({ children, href, activeClassName, id, ...props }) => {
  const { asPath } = useRouter();
  const isActive = asPath === href;

  return (
    <Link href={href} {...props}>
      <StyledLink isActive={isActive} className={isActive ? activeClassName : null} id={id}>
        {children}
      </StyledLink>
    </Link>
  );
};

ActiveLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  activeClassName: PropTypes.string.isRequired,
  id: PropTypes.string, // Added for conditional styling
};

export default ActiveLink;
