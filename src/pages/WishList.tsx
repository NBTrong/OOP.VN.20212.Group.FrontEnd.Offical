import * as React from "react";
import Header from "../components/Header";
import {
  Box,
  Divider,
  Fab,
  Grid,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import Table from "../components/Table";
import DatePickers from "../components/common/DataPickers";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  getListWishList,
  createWishList,
  getIncomeExpenseReport,
  updateWishList,
  deleteWishList,
} from "../services/api";

interface Alert {
  visible: boolean;
  message: string | null;
  severity: "success" | "error" | "info" | "warning" | undefined;
}

export default function WishList({ userKey }: { userKey: string }) {
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState<string | null>(
    moment().format("YYYY-MM-DDThh:mm:ssZ")
  );
  const [data, setData] = React.useState<any[]>([]);
  const [dialogItem, setDialogItem] = React.useState<{
    name: string;
    amount: string;
    id?: number;
  }>({ name: "", amount: "0" });
  const [incomeReport, setIncomeReport] = React.useState<any[]>([] as any[]);
  const [expenseReport, setExpenseReport] = React.useState<any[]>([] as any[]);
  const [router, setRouter] = React.useState<string>("");
  const [alert, setAlert] = React.useState<Alert>({
    visible: false,
    message: null,
    severity: undefined,
  });

  const handleAlert = React.useCallback((alert: Alert) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert({
        visible: false,
        message: null,
        severity: undefined,
      });
    }, 2000);
  }, []);

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

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDialogItem({ ...dialogItem, name: event.target.value });
  };

  const handleChangeAmount = (event: any) => {
    let amount = parseFloat(event.target.value.replace(/\D/g, ""));
    if (isNaN(amount)) {
      amount = 0;
    }
    setDialogItem({ ...dialogItem, amount: amount.toLocaleString() });
  };
  const handleChangeTime = (value: string | null) => {
    setTime(moment(value).format("YYYY-MM-DDThh:mm:ssZ"));
  };

  const handleClickOpen = async (item: any) => {
    setOpen(true);
    setRouter("create");
  };

  const handleDelete = async () => {
    try {
      await deleteWishList({
        userKey,
        id: dialogItem.id,
      });
      handleAlert({
        visible: true,
        message: "Delete success",
        severity: "success",
      });
      await getData();
      setOpen(false);
      setDialogItem({ name: "", amount: "0" });
    } catch {
      handleAlert({
        visible: true,
        message: "Delete failed",
        severity: "error",
      });
      console.log("error");
    }
  };

  const handleSubmit = async (route: string) => {
    try {
      const param = {
        ...dialogItem,
        time,
        userKey,
        amount: parseFloat(dialogItem.amount.replace(/\D/g, "")),
      };
      if (route === "create") {
        await createWishList(param);
      }
      if (route === "update") {
        await updateWishList(param);
      }
      await getData();
      handleAlert({
        visible: true,
        message: "Success",
        severity: "success",
      });
      setOpen(false);
      setDialogItem({ name: "", amount: "0" });
    } catch {
      console.log("error");
      handleAlert({
        visible: true,
        message: "Error",
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = async () => {
    try {
      const result = await getListWishList(userKey, time);
      setData(result.data.data);
    } catch {
      console.log("error");
    }
  };

  const handleClickRow = (item: any) => {
    setOpen(true);
    setDialogItem({
      name: item.name,
      amount: item.amount.toLocaleString(),
      id: item.id,
    });
    setRouter("update");
  };

  React.useEffect(() => {
    const getData = async () => {
      try {
        const result = await getListWishList(userKey, time);
        setData(result.data.data);
      } catch {
        console.log("error");
      }
    };
    getData();
  }, [time, userKey]);

  return (
    <>
      <Header alert={alert}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography variant="h3" fontWeight={600}>
            WISH LIST
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
        <Stack
          alignItems={"center"}
          sx={{
            padding: 1,
          }}
          spacing={0.5}
        >
          <Typography variant="h4">Tổng</Typography>
          <Typography
            variant="h3"
            sx={{
              color: "#2e7d32",
              fontWeight: 600,
            }}
          >
            {(totalExpenseReport + totalIncomeReport).toLocaleString() + "đ"}
          </Typography>
        </Stack>
        <Box
          sx={{
            height: "352px",
            overflowY: "scroll",
          }}
        >
          <Table
            data={data}
            total={totalExpenseReport + totalIncomeReport}
            onClick={handleClickRow}
          />
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <Box
            sx={{
              width: "330px",
            }}
          >
            <DialogContent
              sx={{
                p: 1,
                py: 3,
                width: "100%",
              }}
            >
              <Stack>
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
                    <Typography variant="h3">Name</Typography>
                  </Grid>
                  <Grid item xs={10} textAlign="center" py={0.5}>
                    <InputBase
                      value={dialogItem.name}
                      placeholder="Nhập tên vật phẩm "
                      onChange={handleChangeName}
                    />
                  </Grid>
                </Grid>
                <Divider orientation="horizontal" flexItem />
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
                    <Typography variant="h3">Số tiền</Typography>
                  </Grid>
                  <Grid item xs={10} textAlign="center" py={0.5}>
                    <InputBase
                      value={dialogItem.amount}
                      placeholder="Nhập số tiền"
                      onChange={handleChangeAmount}
                    />
                  </Grid>
                </Grid>
                <Divider orientation="horizontal" flexItem />
              </Stack>
            </DialogContent>
            <DialogActions
              sx={{
                pt: 0,
              }}
            >
              <Button onClick={() => handleDelete()} size="small">
                <Typography variant="h3" color="red">
                  Delete
                </Typography>
              </Button>
              <Button onClick={handleClose} size="small">
                <Typography variant="h3" color="#ccc">
                  Cancel
                </Typography>
              </Button>
              <Button onClick={() => handleSubmit(router)} size="small">
                <Typography variant="h3">Submit</Typography>
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Stack>
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        sx={{
          position: "absolute",
          bottom: "85px",
          right: "0px",
          left: "286px",
        }}
        onClick={handleClickOpen}
      >
        <AddIcon sx={{ color: "#fff" }} />
      </Fab>
    </>
  );
}
