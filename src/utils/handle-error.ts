import type { ErrorResponse } from "@/types/error";
import type { AxiosError } from "axios";

export function getMessage(e: unknown) {
  let errMsg = ""
  console.error(e);
  const err = e as AxiosError<ErrorResponse>
  if (err.status == 500) {
    errMsg = "Oops, something went wrong 😅, please try later!"
  } else {
    errMsg = err.response?.data.message || "Oops, something went wrong 😅, please try later!";
  }
  return errMsg
}