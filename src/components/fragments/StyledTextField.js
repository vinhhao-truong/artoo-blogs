import React, { useState, forwardRef } from "react";

import { selectMyProfile } from "../store/user/myProfile-slice";
import { useSelector } from "react-redux";

import { styled as styleMUI } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { DatePicker } from "@mui/x-date-pickers";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Stack from "@mui/material/Stack";
import enLocale from "date-fns/locale/en-GB";

const StyledOutlinedTF = styleMUI(TextField)(() => {
  const pickedColor = useSelector(selectMyProfile).pickedColor;

  return {
    "& label.Mui-focused": {
      color: pickedColor,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: pickedColor,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: pickedColor,
      },
    },
  };
});

const StyledOutlinedFormControl = styleMUI(FormControl)(() => {
  const pickedColor = useSelector(selectMyProfile).pickedColor;

  return {
    "& label.Mui-focused": {
      color: pickedColor,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: pickedColor,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: pickedColor,
      },
    },
  };
});

const StyledOutlinedDatePicker = styleMUI(DatePicker)(() => {
  const pickedColor = useSelector(selectMyProfile).pickedColor;

  return {
    "& label.Mui-focused": {
      color: pickedColor,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: pickedColor,
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: pickedColor,
      },
    },
  };
});

const PasswordField = forwardRef((props, ref) => {
  const [pwIsShowed, setPwIsShowed] = useState(false);

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleClickShowPassword = () => {
    setPwIsShowed(!pwIsShowed);
  };

  return (
    <StyledOutlinedFormControl
      className="password-field"
      variant="outlined"
      fullWidth
    >
      <InputLabel htmlFor="outlined-adornment-password">
        {props.label}
      </InputLabel>
      <OutlinedInput
        ref={ref ? ref : null}
        type={pwIsShowed ? "text" : "password"}
        value={props.value}
        onChange={props.onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {!pwIsShowed ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
      {props.error.isErr && (
        <FormHelperText error={props.error.isErr}>
          {props.error.msg}
        </FormHelperText>
      )}
    </StyledOutlinedFormControl>
  );
});

const TxtField = forwardRef((props, ref) => {
  return (
    <StyledOutlinedTF
      ref={ref ? ref : null}
      error={props.error && props.error.isErr}
      helperText={props.error && props.error.msg}
      className="txt-field"
      label={props.label}
      variant="outlined"
      onChange={props.onChange}
      value={props.value}
      fullWidth
      required={props.required}
      multiline={props.multiline}
      rows={props.rows}
      size={props.size}
    />
  );
});

const DateField = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <Stack spacing={3}></Stack>
      <DatePicker
        disableFuture={props.disableFuture}
        openTo="day"
        views={["day"]}
        label={props.label}
        value={props.value}
        onChange={props.onChange}
        renderInput={(params) => (
          <>
            <StyledOutlinedTF
              {...params}
              error={false}
              helperText={null}
              fullWidth
            />
            {props.error.isErr && (
              <FormHelperText error={props.error.isErr}>{props.error.msg}</FormHelperText>
            )}
          </>
        )}
      />
    </LocalizationProvider>
  );
};

export {
  StyledOutlinedTF,
  StyledOutlinedFormControl,
  StyledOutlinedDatePicker,
  PasswordField,
  TxtField,
  DateField
};
