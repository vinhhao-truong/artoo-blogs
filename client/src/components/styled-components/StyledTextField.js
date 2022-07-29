import React, { useState, forwardRef } from "react";

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
import Autocomplete from "@mui/material/Autocomplete";

import useAuthColor from "../hooks/useAuthColor";

const StyledOutlinedTF = styleMUI(TextField)(() => {
  const pickedColor = useAuthColor();

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
  const pickedColor = useAuthColor();

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
  const pickedColor = useAuthColor();

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
        required={props.required}
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
  const classes = props.className ? props.className : "";

  return (
    <StyledOutlinedTF
      ref={ref ? ref : null}
      error={props.error && props.error.isErr}
      helperText={props.error && props.error.msg}
      className={"txt-field " + classes}
      label={props.label}
      variant="outlined"
      onChange={props.onChange}
      value={props.value}
      fullWidth
      required={props.required}
      multiline={props.multiline}
      minRows={props.minRows}
      size={props.size}
      autoFocus={props.autoFocus}
      onFocus={props.onFocus}
    />
  );
});

const StyledAutoComplete = (props) => {
  const classes = props.className ? props.className : "";
  return (
    <Autocomplete
      onSelect={props.onChange}
      className={"autocomplete " + classes}
      fullWidth={props.fullWidth}
      required={props.required}
      size={props.size}
      options={props.options}
      autoFocus={props.autoFocus}
      onFocus={props.onFocus}
      freeSolo={props.freeSolo}
      renderInput={(params) => (
        <StyledOutlinedTF value={props.value} {...params} label={props.label} />
      )}
    />
  );
};

const DateField = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enLocale}>
      <Stack spacing={3}></Stack>
      <DatePicker
        disableFuture={props.disableFuture}
        minDate={new Date("1900")}
        openTo="day"
        views={["year", "month", "day"]}
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
              <FormHelperText error={props.error.isErr}>
                {props.error.msg}
              </FormHelperText>
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
  DateField,
  StyledAutoComplete,
};
