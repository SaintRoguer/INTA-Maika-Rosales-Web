import React from "react";
import PropTypes from "prop-types";
import { styled } from '@mui/system';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Clear from "@mui/icons-material/Clear";
import Check from "@mui/icons-material/Check";
import styles from "assets/jss/nextjs-material-dashboard/components/customInputStyle.js";

// Styled components
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  ...styles.formControl,
}));

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  ...styles.labelRoot,
  '&.error': {
    ...styles.labelRootError,
  },
  '&.success': {
    ...styles.labelRootSuccess,
  },
}));

const StyledInput = styled(Input)(({ theme }) => ({
  '&.marginTop': {
    ...styles.marginTop,
  },
  '&.disabled:before': {
    ...styles.disabled["&:before"],
  },
  '&.underline': {
    ...styles.underline,
  },
  '&.underlineError:after': {
    ...styles.underlineError["&:after"],
  },
  '&.underlineSuccess:after': {
    ...styles.underlineSuccess["&:after"],
  },
}));

const FeedbackIcon = styled('div')(({ theme }) => ({
  ...styles.feedback,
}));

export default function CustomInput(props) {
  const {
    formControlProps,
    labelText,
    id,
    labelProps,
    inputProps,
    error,
    success,
  } = props;

  return (
    <StyledFormControl
      {...formControlProps}
    >
      {labelText !== undefined ? (
        <StyledInputLabel
          className={`${error ? 'error' : success ? 'success' : ''}`}
          htmlFor={id}
          {...labelProps}
        >
          {labelText}
        </StyledInputLabel>
      ) : null}
      <StyledInput
        className={`${labelText === undefined ? 'marginTop' : ''} underline ${error ? 'underlineError' : success ? 'underlineSuccess' : ''}`}
        id={id}
        {...inputProps}
      />
      {error ? (
        <FeedbackIcon className="error">
          <Clear />
        </FeedbackIcon>
      ) : success ? (
        <FeedbackIcon className="success">
          <Check />
        </FeedbackIcon>
      ) : null}
    </StyledFormControl>
  );
}

CustomInput.propTypes = {
  labelText: PropTypes.node,
  labelProps: PropTypes.object,
  id: PropTypes.string,
  inputProps: PropTypes.object,
  formControlProps: PropTypes.object,
  error: PropTypes.bool,
  success: PropTypes.bool,
};
