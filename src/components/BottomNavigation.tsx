import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Box } from "@mui/material";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PieChartOutlinedIcon from "@mui/icons-material/PieChartOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { useNavigate } from "react-router-dom";

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("input");
  const navigate = useNavigate();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const Tabs = [
    {
      content: "Nhập vào",
      value: "input",
      icon: <CreateOutlinedIcon fontSize="small" />,
      handleClick: () => {
        navigate("../insert", { replace: true });
      },
    },
    {
      content: "Lịch",
      value: "calendar",
      handleClick: () => {
        navigate("../list", { replace: true });
      },
      icon: <CalendarMonthOutlinedIcon fontSize="small" />,
    },
    {
      content: "Báo cáo",
      value: "report",
      handleClick: () => {
        navigate("../report", { replace: true });
      },
      icon: <PieChartOutlinedIcon fontSize="small" />,
    },
    {
      content: "Khác",
      value: "other",
      handleClick: () => {
        navigate("../insert", { replace: true });
      },
      icon: <MoreHorizOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <Box
      className="Navigation"
      sx={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        backgroundColor: "#fafafa",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        {Tabs.map((tab, index) => (
          <BottomNavigationAction
            label={tab.content}
            icon={tab.icon}
            value={tab.value}
            onClick={tab.handleClick}
            sx={{
              span: {
                fontSize: "10px !important",
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
}
