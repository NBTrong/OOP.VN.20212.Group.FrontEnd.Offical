import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000/",
});

interface Data {
  userKey: string;
  amount: number;
  time: string | null;
  categoryId: number | undefined;
  note: string;
}

export const getCategories = (status: "income" | "expense") => {
  return api({
    method: "POST",
    url: "api/v1/category",
    data: {
      status: status,
    },
  });
};

export const createIncomeExpense = (data: Data, status: string) => {
  if (status === "income") {
    return api({
      method: "POST",
      url: "api/v1/income/create",
      data: data,
    });
  }
  return api({
    method: "POST",
    url: "api/v1/expense/create",
    data: {
      ...data,
      amount: data.amount - 2*data.amount,
    },
  });
};

export const getIncomeExpense = (
  userKey: string,
  time: string | null,
  status: string
) => {
  if (status === "income") {
    return api({
      method: "POST",
      url: "api/v1/income",
      data: {
        userKey: userKey,
        time: time,
      },
    });
  }
  return api({
    method: "POST",
    url: "api/v1/expense",
    data: {
      userKey: userKey,
      time: time,
    },
  });
};
