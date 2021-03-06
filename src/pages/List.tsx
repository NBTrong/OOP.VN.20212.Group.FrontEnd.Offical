import React, { useEffect } from "react";
import { Typography, Box, Stack, Divider, Grid } from "@mui/material";
import Header from "../components/Header";
import DatePickers from "../components/common/DataPickers";
import { getIncomeExpense } from "../services/api";
import moment from "moment";
import Item from "../components/common/Item";
import { useNavigate } from "react-router-dom";

export default function List({ userKey }: { userKey: string }) {
  const [time, setTime] = React.useState<string | null>(
    moment().format("YYYY-MM-DDThh:mm:ssZ")
  );
  const navigate = useNavigate();
  const [expense, setExpense] = React.useState<any[]>([] as any[]);
  const [income, setIncome] = React.useState<any[]>([] as any[]);
  const flag = React.useRef("");

  const list = React.useMemo(() => {
    const merged = [...income, ...expense];
    merged.sort((a, b) => {
      return moment(b.time, "YYYY-MM-DD hh:mm:ss").diff(
        moment(a.time, "YYYY-MM-DD hh:mm:ss")
      );
    });
    return merged;
  }, [expense, income]);

  const countExpense = React.useMemo(() => {
    let initialValue = 0;
    for (let item of expense) {
      initialValue += item.amount;
    }
    return initialValue;
  }, [expense]);

  const countIncome = React.useMemo(() => {
    let initialValue = 0;
    for (let item of income) {
      initialValue += item.amount;
    }
    return initialValue;
  }, [income]);

  const handleChangeTime = (value: string | null) => {
    setTime(moment(value).format("YYYY-MM-DDThh:mm:ssZ"));
  };

  const getExpense = React.useCallback(async () => {
    try {
      const result = await getIncomeExpense(userKey, time, "expense");
      setExpense(result.data.data);
    } catch {
      console.log("error");
    }
  }, [userKey, time]);

  const getIncome = React.useCallback(async () => {
    try {
      const result = await getIncomeExpense(userKey, time, "income");
      setIncome(result.data.data);
    } catch {
      console.log("error");
    }
  }, [userKey, time]);

  const handleClickItem = (item: any) => {
    navigate(`../update/${item.category.status}/${item.id}`, { replace: true });
  };

  useEffect(() => {
    getExpense();
    getIncome();
  }, [time, getExpense, getIncome]);

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
            DANH S??CH CHI TI??U
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
        <Grid container py={1}>
          <Grid item xs={4}>
            <Stack alignItems={"center"}>
              <Typography variant="h4">Thu nh???p</Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#2e7d32",
                  fontWeight: 600,
                }}
              >
                {countIncome.toLocaleString() + "??"}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack alignItems={"center"}>
              <Typography variant="h4">Chi ti??u</Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#bf360c",
                  fontWeight: 600,
                }}
              >
                {countExpense.toLocaleString() + "??"}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack alignItems={"center"}>
              <Typography variant="h4">T???ng</Typography>
              <Typography
                variant="h3"
                sx={{
                  color: "#1565c0",
                  fontWeight: 600,
                }}
              >
                {(countIncome + countExpense).toLocaleString() + "??"}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Box
          sx={{
            height: "352px",
            overflowY: "scroll",
          }}
        >
          {list.map((item, index) => {
            let locked = false;
            if (
              moment(item.time).format("YYYY-MM-DD") ===
              moment(flag.current).format("YYYY-MM-DD")
            ) {
              locked = true;
            } else {
              flag.current = item.time;
            }
            return (
              <>
                {(!locked || index === 0) && (
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{
                      backgroundColor: "#f5f5f5",
                      padding: 0.5,
                      px: 2,
                    }}
                  >
                    <Typography variant="h4" fontWeight={600}>
                      {moment(item.time).format("DD-MM-YYYY")}
                    </Typography>
                    {/* <Typography variant="h5" fontWeight={600}>
                    -100.000
                  </Typography> */}
                  </Stack>
                )}
                <Item
                  key={index}
                  item={item}
                  onClick={() => handleClickItem(item)}
                />
                <Divider orientation="horizontal" flexItem />
              </>
            );
          })}
        </Box>
      </Stack>
    </>
  );
}
