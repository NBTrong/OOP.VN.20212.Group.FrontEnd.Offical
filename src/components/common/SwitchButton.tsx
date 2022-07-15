import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Typography } from "@mui/material";

export default function ColorToggleButton({
  content,
  onChange,
  alignment,
}: {
  content: { value: string; label: string }[];
  onChange: (event: React.MouseEvent<HTMLElement>, newTitle: string) => void;
  alignment: string;
}) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={alignment}
      exclusive
      size="small"
      onChange={onChange}
    >
      {content.map((item, index) => (
        <ToggleButton key={index} value={item.value}>
          <Typography variant="h4">{item.label}</Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
