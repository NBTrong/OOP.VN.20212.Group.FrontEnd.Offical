import React from "react";
import { Box, Alert } from "@mui/material";

export default function Header({
  children,
  alert,
}: {
  children: React.ReactNode;
  alert?: {
    visible: boolean;
    message: string | null;
    severity: "success" | "error" | "info" | "warning" | undefined;
  };
}) {
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
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      {alert?.visible && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
          }}
        >
          <Alert
            severity={alert.severity}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {alert.message}
          </Alert>
        </Box>
      )}
      {children}
    </Box>
  );
}
