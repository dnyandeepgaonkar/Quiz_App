import axios from "axios";

const axiosInstance = axios.create({});

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;

  if (typeof data === "string") {
    return data;
  }

  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors
      .map((item) => item?.message || item?.msg || item)
      .filter(Boolean)
      .join(", ");
  }

  return (
    data?.message ||
    data?.error ||
    error?.message ||
    fallback
  );
};

export const apiConnector = async (method, url, bodyData, headers, params) => {
  return await axiosInstance({
    method: method,
    url: url,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};
