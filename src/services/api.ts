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

export const getCategories = (status: string) => {
  return api({
    method: "POST",
    url: "api/v1/category",
    data: {
      status: status,
    },
  });
};

export const getOneIncomeExpense = (
  id: string | undefined,
  status: string | undefined
) => {
  return api({
    method: "GET",
    url: `api/v1/${status}/${id}`,
    data: {
      id: id,
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
      amount: data.amount - 2 * data.amount,
    },
  });
};

export const updateIncomeExpense = (data: Data, status: string) => {
  if (status === "income") {
    return api({
      method: "PATCH",
      url: "api/v1/income/update",
      data: data,
    });
  }
  return api({
    method: "PATCH",
    url: "api/v1/expense/update",
    data: {
      ...data,
      amount: data.amount - 2 * data.amount,
    },
  });
};

export const deleteIncomeExpense = (data: any, status: string) => {
  if (status === "income") {
    return api({
      method: "DELETE",
      url: "api/v1/income/delete",
      data: data,
    });
  }
  return api({
    method: "DELETE",
    url: "api/v1/expense/delete",
    data: {
      ...data,
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

export const getIncomeExpenseReport = (
  userKey: string,
  time: string | null,
  status: string
) => {
  return api({
    method: "POST",
    url: "api/v1/category/report",
    data: {
      userKey: userKey,
      time: time,
      status: status,
    },
  });
};

export const getListWishList = (userKey: string, time: string | null) => {
  return api({
    method: "POST",
    url: "api/v1/wishlist",
    data: {
      userKey: userKey,
      time: time,
    },
  });
};

export const createWishList = (data: any) => {
  return api({
    method: "POST",
    url: "api/v1/wishlist/create",
    data: data,
  });
};

export const updateWishList = (data: any) => {
  return api({
    method: "PATCH",
    url: "api/v1/wishlist/update",
    data: data,
  });
};

export const deleteWishList = (data: any) => {
  return api({
    method: "DELETE",
    url: "api/v1/wishlist/delete",
    data: data,
  });
};
