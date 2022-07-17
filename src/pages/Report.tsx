import React from "react";
import {
  Typography,
  Box,
  Stack,
  Divider,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import Header from "../components/Header";
import DatePickers from "../components/common/DataPickers";
import moment from "moment";
import AppBar from "@mui/material/AppBar";
import PieChart from "../components/common/PieChart";
import { getIncomeExpenseReport } from "../services/api";
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function Item({ data, total }: { data: any; total: number }) {
  if (data) {
    return (
      <Grid container p={1} px={2} spacing={2}>
        <Grid item xs={5}>
          <Stack spacing={0.5} direction="row" color={data.color}>
            <i className={data.icon}></i>
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
              {data.name}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={3.5}>
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
              fontWeight: "bold",
            }}
          >
            {data.totalAmount.toLocaleString()} đ
          </Typography>
        </Grid>
        <Grid item xs={3.5}>
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
            {((data.totalAmount / total) * 100).toFixed(1)} %
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return null;
}

export default function Report({ userKey }: { userKey: string }) {
  const [time, setTime] = React.useState<string | null>(
    moment().format("YYYY-MM-DDThh:mm:ssZ")
  );
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [incomeReport, setIncomeReport] = React.useState<any[]>([] as any[]);
  const [expenseReport, setExpenseReport] = React.useState<any[]>([] as any[]);

  const totalExpenseReport = React.useMemo(() => {
    let count = 0;
    for (let item of expenseReport) {
      if (item?.totalAmount) {
        count += item?.totalAmount;
      }
    }
    return count;
  }, [expenseReport]);
  const totalIncomeReport = React.useMemo(() => {
    let count = 0;
    for (let item of incomeReport) {
      if (item?.totalAmount) {
        count += item?.totalAmount;
      }
    }
    return count;
  }, [incomeReport]);

  const currentList = React.useMemo(() => {
    if (value === 0) return expenseReport;
    return incomeReport;
  }, [value, expenseReport, incomeReport]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const handleChangeTime = (value: string | null) => {
    setTime(moment(value).format("YYYY-MM-DDThh:mm:ssZ"));
  };

  const getExpenseReport = React.useCallback(async () => {
    try {
      const result = await getIncomeExpenseReport(userKey, time, "expense");
      setExpenseReport(result.data.data);
    } catch {
      console.log("error");
    }
  }, [time, userKey]);

  const getIncomeReport = React.useCallback(async () => {
    try {
      const result = await getIncomeExpenseReport(userKey, time, "income");
      setIncomeReport(result.data.data);
    } catch {
      console.log("error");
    }
  }, [time, userKey]);

  React.useEffect(() => {
    getExpenseReport();
    getIncomeReport();
  }, [getExpenseReport, getIncomeReport]);

  return (
    <>
      <Header>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3" fontWeight={600}>
            THỐNG KÊ TÀI CHÍNH
          </Typography>
        </Box>
      </Header>

      <Stack divider={<Divider orientation="horizontal" flexItem />}>
        <DatePickers
          onChange={handleChangeTime}
          time={time}
          inputFormat="MM/yyyy"
          views={["month", "year"]}
          sx={{ width: "80%", margin: "auto", marginTop: 1, marginBottom: 1 }}
        />
        <Box sx={{ width: "100%" }}>
          <AppBar
            position="static"
            sx={{
              backgroundColor: "#fff",
              boxShadow: "none",
              borderBottom: "0.2px solid #ccc",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="inherit"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label="Chi tiêu" {...a11yProps(0)} />
              <Tab label="Thu nhập" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            {[0, 1].map((item) => (
              <TabPanel value={value} index={item} dir={theme.direction}>
                <PieChart
                  data={currentList.map((item) => {
                    return {
                      title: item.name,
                      value: Math.abs(item.totalAmount),
                      color: item.color,
                    };
                  })}
                />
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    height: 20,
                  }}
                ></Box>
                <Stack
                  direction={"row"}
                  justifyContent="space-between"
                  px={2}
                  py={1}
                >
                  <Typography variant="h3">Tổng</Typography>
                  <Typography variant="h3">
                    {item === 0
                      ? totalExpenseReport.toLocaleString()
                      : totalIncomeReport.toLocaleString()}{" "}
                    đ
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    backgroundColor: "#f5f5f5",
                    height: 20,
                  }}
                ></Box>
                <Box
                  sx={{
                    height: "140px",
                    overflowY: "scroll",
                  }}
                >
                  {currentList.map((item) => (
                    <>
                      <Item
                        data={item}
                        total={
                          value === 0 ? totalExpenseReport : totalIncomeReport
                        }
                      />
                      <Divider orientation="horizontal" flexItem />
                    </>
                  ))}
                </Box>
              </TabPanel>
            ))}
          </SwipeableViews>
        </Box>
      </Stack>
    </>
  );
}
