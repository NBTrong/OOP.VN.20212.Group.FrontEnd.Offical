import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
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
import { getCategories, deleteIncomeExpense } from "../services/api";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { getOneIncomeExpense, updateIncomeExpense } from "../services/api";
interface Data {
  userKey: string;
  amount: string;
  time: string | null;
  categoryId: number | undefined;
  note: string;
  id: string | null | number;
}

export default function Update({ userKey }: { userKey: string }) {
  const { status, id } = useParams();
  const [title, setTitle] = useState("");
  const [currentCategory, setCurrentCategory] = useState<number>();
  const [data, setData] = useState<Data>({} as Data);
  const [categoryStore, setCategoryStore] = useState([] as any[]);
  const navigate = useNavigate();
  const getCategory = useCallback(async () => {
    if (title) {
      try {
        const result = await getCategories(title);
        setCategoryStore(result.data.data);
      } catch {
        console.log("error");
      }
    }
  }, [title]);

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
      await updateIncomeExpense(param, title);
      navigate("../list", { replace: true });
    } catch {
      console.log("error");
    }
  };

  const handleDelete = async () => {
    try {
      const param = {
        userKey,
        id: data.id,
      };
      await deleteIncomeExpense(param, title);
      navigate("../list", { replace: true });
    } catch {
      console.log("error");
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await getOneIncomeExpense(id, status);
        setTitle(result.data.data.category.status);
        setCurrentCategory(result.data.data.category.id);
        setData({
          id: result.data.data.id,
          userKey: userKey,
          amount: Math.abs(result.data.data.amount).toLocaleString(),
          note: result.data.data.note,
          categoryId: result.data.data.category.id,
          time: moment(result.data.data.time).format("YYYY-MM-DDThh:mm:ssZ"),
        });
      } catch {
        console.log("error");
      }
    };
    getData();
  }, [id, status, userKey]);

  useEffect(() => {
    getCategory();
  }, [getCategory]);

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
            Chỉnh sửa
          </Typography>
        </Box>
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
            <Typography variant="h3">Ngày</Typography>
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
            <Typography variant="h3">Ghi chú</Typography>
          </Grid>
          <Grid item xs={10} textAlign="center" py={0.5}>
            <InputBase
              value={data.note}
              placeholder="Nhập ghi chú"
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
            <Typography variant="h3">Tiền chi</Typography>
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
              Danh mục
            </Typography>
          </Grid>
          <Grid item xs={12} textAlign="start" py={0.5}>
            {categoryStore.map((item) => (
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
            bottom: 108,
            left: 0,
            right: 0,
            width: "80%",
            borderRadius: "20px",
            mx: "auto",
          }}
        >
          <Typography variant="h2" fontWeight={500} color="#fff">
            Chỉnh sửa khoản chi
          </Typography>
        </Button>
        <Button
          variant="contained"
          disableElevation
          onClick={handleDelete}
          sx={{
            position: "absolute",
            bottom: 67,
            left: 0,
            right: 0,
            width: "80%",
            borderRadius: "20px",
            mx: "auto",
            backgroundColor: "red",
          }}
        >
          <Typography variant="h2" fontWeight={500} color="#fff">
            Xóa khoản chi
          </Typography>
        </Button>
      </Stack>
    </>
  );
}
