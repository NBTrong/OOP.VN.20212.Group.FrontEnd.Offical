import * as React from "react";
import TextField from "@mui/material/TextField";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { CalendarPickerView } from "@mui/x-date-pickers";

type Props = {
  onChange: (value: string | null) => void;
  time: string | null;
  inputFormat: string;
  views?: CalendarPickerView[];
  sx?: React.CSSProperties;
};

export default function DatePickers({
  onChange,
  time,
  inputFormat,
  views,
  sx = {},
}: Props) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        inputFormat={inputFormat}
        views={views ? views : undefined}
        value={time}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            sx={{
              ...sx,
              input: {
                textAlign: "center",
                py: 0.2,
                px: 0.5,
                backgroundColor: "#fff3e0",
                borderRadius: "4px",
              },
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
}
