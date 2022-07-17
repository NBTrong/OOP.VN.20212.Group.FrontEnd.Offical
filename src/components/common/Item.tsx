import React from "react";
import { Typography, Stack, Grid, Button } from "@mui/material";

export default function Item({ item, onClick }: { item: any; onClick: any }) {
  return (
    <>
      <Button
        variant="text"
        sx={{
          width: "100%",
          padding: 0,
        }}
        onClick={onClick}
      >
        <Grid container p={1} px={2} spacing={2}>
          <Grid item xs={4}>
            <Stack spacing={0.5} direction="row" color={item.category.color}>
              <i className={item.category.icon}></i>
              <Typography
                variant="h4"
                pt={0.3}
                pl={0.5}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                  color: "#000 !important",
                  fontWeight: "bold",
                }}
              >
                {item.category.name}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="h4"
              pt={0.3}
              pl={0.5}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                color: "#000 !important",
                textAlign: "center",
              }}
            >
              {item.note}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="h4"
              pt={0.3}
              pl={0.5}
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                color: "#000 !important",
                textAlign: "right",
                fontWeight: "bold",
              }}
            >
              {item.amount.toLocaleString()}đ
            </Typography>
          </Grid>
        </Grid>
      </Button>
    </>
  );
}
