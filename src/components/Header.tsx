import React from "react";
import { Box } from "@mui/material";

export default function Header({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        height: "50px",
        width: "100%",
        backgroundColor: "#fafafa",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {children}
    </Box>
  );
}
