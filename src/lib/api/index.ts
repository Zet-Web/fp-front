import axios, { type AxiosError, type AxiosInstance } from "axios";
import { ErrorResponse } from "./types";
import { UNAUTH_CODE } from "./helpers";
import { supabase } from "@/lib/supabase";

const HEADERS = {
  Accept: "application/json",
};

class FPApiClass {
  public axios: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: HEADERS,
  });

  public configre() {
    this.axios.interceptors.response.use(
      async (response) => {
        const result: ErrorResponse | Record<string, unknown> = response.data;

        if (result?.statusCode && result?.statusCode === UNAUTH_CODE) {
          await supabase.auth.signOut();
        }

        const hasError =
          result &&
          typeof result === "object" &&
          "statusCode" in result &&
          result.statusCode !== 0;

        if (hasError) {
          return Promise.reject(result.message);
        }

        return response;
      },
      async (error) => {
        if (error && !!error.isAxiosError) {
          const err = error as AxiosError<
            ErrorResponse | Record<string, unknown>
          >;
          if (err.response?.status === UNAUTH_CODE) {
            await supabase.auth.signOut();
          }

          return Promise.reject(err.response?.data);
        }

        return Promise.reject(error);
      }
    );
  }

  public updateAuth(authToken?: string): void {
    this.axios.defaults.headers.Authorization = authToken
      ? `Bearer ${authToken}`
      : "";
  }
}

export const FPApi = new FPApiClass();
