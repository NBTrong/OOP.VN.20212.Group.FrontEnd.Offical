import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Button,
  Divider,
  Grid,
  InputAdornment,
  InputBase,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DataPickers from "../components/common/DataPickers";
import Header from "../components/Header";
import SwitchButton from "../components/common/SwitchButton";
import { getCategories, createIncomeExpense } from "../services/api";
import moment from "moment";

interface Data {
  userKey: string;
  amount: string;
  time: string | null;
  categoryId: number | undefined;
  note: string;
}

interface Alert {
  visible: boolean;
  message: string | null;
  severity: "success" | "error" | "info" | "warning" | undefined;
}

export default function Insert({ userKey }: { userKey: string }) {
  const [title, setTitle] = useState("expense");
  const [incomeStore, setIncomeStore] = useState([] as any[]);
  const [expenseStore, setExpenseStore] = useState([] as any[]);
  const [currentCategory, setCurrentCategory] = useState<number>();
  const [data, setData] = useState<Data>({
    userKey,
    amount: "0",
    time: moment().format("YYYY-MM-DDThh:mm:ssZ"),
    categoryId: undefined,
    note: "",
  });
  const [alert, setAlert] = useState<Alert>({
    visible: false,
    message: null,
    severity: undefined,
  });

  const handleAlert = useCallback((alert: Alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert({
        visible: false,
        message: null,
        severity: undefined,
      });
    }, 2000);
  }, []);

  const currentStore = useMemo(() => {
    if (title === "income") {
      return incomeStore;
    }
    return expenseStore;
  }, [title, incomeStore, expenseStore]);

  const handleChangeSwitch = useCallback(
    (event: React.MouseEvent<HTMLElement>, newTitle: string) => {
      setTitle(newTitle);
      setCurrentCategory(undefined);
      setData({
        note: "",
        amount: "0",
        time: moment().format("YYYY-MM-DDThh:mm:ssZ"),
        categoryId: 0,
        userKey,
      });
    },
    [userKey]
  );

  const getCategoryIncome = useCallback(async () => {
    try {
      const result = await getCategories("income");
      setIncomeStore(result.data.data);
    } catch {
      console.log("error");
    }
  }, []);

  const getCategoryExpense = useCallback(async () => {
    try {
      const result = await getCategories("expense");
      setExpenseStore(result.data.data);
    } catch {
      console.log("error");
    }
  }, []);

  const handleClickCategory = useCallback((id: number) => {
    setCurrentCategory(id);
  }, []);

  const handleChangeTime = (value: string | null) => {
    setData({ ...data, time: moment(value).format("YYYY-MM-DDThh:mm:ssZ") });
  };

  const handleChangeNote = (event: any) => {
    const note: string = event.target.value;
    setData({ ...data, note });
  };

  const handleChangeAmount = (event: any) => {
    let amount = parseFloat(event.target.value.replace(/\D/g, ""));
    if (isNaN(amount)) {
      amount = 0;
    }
    setData({ ...data, amount: amount.toLocaleString() });
  };

  const handleSubmit = async () => {
    try {
      const param = {
        ...data,
        categoryId: currentCategory,
        userKey,
        amount: parseFloat(data.amount.replace(/\D/g, "")),
      };
      await createIncomeExpense(param, title);
      setData({
        time: moment().format("YYYY-MM-DDThh:mm:ssZ"),
        amount: "0",
        categoryId: undefined,
        note: "",
        userKey,
      });
      setCurrentCategory(undefined);
      handleAlert({
        visible: true,
        message: "Successfully created",
        severity: "success",
      });
    } catch {
      console.log("error");
      handleAlert({
        visible: true,
        message: "Create failed",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    getCategoryIncome();
  }, [getCategoryIncome]);

  useEffect(() => {
    getCategoryExpense();
  }, [getCategoryExpense]);

  return (
    <>
      <Header alert={alert}>
        <Stack direction="row" justifyContent="center" py={1.2}>
          <SwitchButton
            content={[
              { value: "expense", label: "Ti???n chi" },
              { value: "income", label: "Ti???n thu" },
            ]}
            onChange={handleChangeSwitch}
            alignment={title}
          />
        </Stack>
      </Header>
      <Stack divider={<Divider orientation="horizontal" flexItem />}>
        <Grid container pl={2}>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">Ng??y</Typography>
          </Grid>
          <Grid item xs={10} textAlign="center" py={0.5}>
            <DataPickers
              onChange={handleChangeTime}
              time={data.time}
              inputFormat="dd/MM/yyyy"
            />
          </Grid>
        </Grid>
        <Grid container pl={2}>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">Ghi ch??</Typography>
          </Grid>
          <Grid item xs={10} textAlign="center" py={0.5}>
            <InputBase
              value={data.note}
              placeholder="Nh???p ghi ch??"
              onChange={handleChangeNote}
            />
          </Grid>
        </Grid>
        <Grid container pl={2}>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">Ti???n chi</Typography>
          </Grid>
          <Grid item xs={10} textAlign="center" py={0.5}>
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="h4">VND</Typography>
                  </InputAdornment>
                ),
              }}
              value={data.amount}
              size="small"
              onChange={handleChangeAmount}
              sx={{
                input: {
                  textAlign: "center",
                  py: 0.2,
                  px: 0.2,
                  width: "150px",
                  borderRadius: "4px",
                  backgroundColor: "#fff3e0",
                },
              }}
            />
          </Grid>
        </Grid>
        <Grid container pl={2} py={1}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" pb={0.5}>
              Danh m???c
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="start" py={0.5}>
            {currentStore.map((item) => (
              <Button
                key={item.id}
                className={currentCategory == item.id ? "hover" : ""}
                variant="outlined"
                size="large"
                sx={{
                  color: `${item.color}`,
                  width: "30%",
                  m: 0.2,
                  border: "1px solid #eee",
                }}
                onClick={() => handleClickCategory(item.id)}
              >
                <Stack spacing={0.5}>
                  <i className={item.icon}></i>
                  <Typography
                    variant="h5"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      display: "block",
                      color: "#000 !important",
                    }}
                  >
                    {item.name}
                  </Typography>
                </Stack>
              </Button>
            ))}
          </Grid>
        </Grid>
        <Button
          variant="contained"
          disableElevation
          onClick={handleSubmit}
          sx={{
            position: "absolute",
            bottom: 67,
            left: 0,
            right: 0,
            width: "80%",
            borderRadius: "20px",
            mx: "auto",
          }}
        >
          <Typography variant="h2" fontWeight={500} color="#fff">
            Nh???p kho???n chi
          </Typography>
        </Button>
      </Stack>
    </>
  );
}
