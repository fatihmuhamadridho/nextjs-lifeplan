import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_API_URL } from '@configs/base.config';
import { getAccessToken } from './accessToken.service';

export interface AxiosServiceOptions {
  baseURL?: string;
  accessToken?: () => string | null;
}

export class AxiosService {
  private readonly client: AxiosInstance;
  private readonly options: AxiosServiceOptions;

  constructor(options?: AxiosServiceOptions) {
    this.options = { ...options };

    this.client = axios.create({
      baseURL: this.options.baseURL ?? BASE_API_URL,
    });

    if (this.options.accessToken) {
      this.client.interceptors.request.use((config) => {
        const token = this.options.accessToken?.();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    }
  }

  get<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.client.get<T>(url, config).then((res) => res.data);
  }

  getWithResponse<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<T, D>> {
    return this.client.get<T, AxiosResponse<T, D>, D>(url, config);
  }

  post<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.client.post<T, AxiosResponse<T, D>, D>(url, data, config).then((res) => res.data);
  }

  put<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.client.put<T, AxiosResponse<T, D>, D>(url, data, config).then((res) => res.data);
  }

  patch<T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.client.patch<T, AxiosResponse<T, D>, D>(url, data, config).then((res) => res.data);
  }

  delete<T = unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T> {
    return this.client.delete<T, AxiosResponse<T, D>, D>(url, config).then((res) => res.data);
  }
}

/** Dedicated client for the LifePlan Express API; its token is never sent to other API hosts. */
export const lifePlanApi = new AxiosService({
  baseURL: BASE_API_URL,
  accessToken: getAccessToken,
});

export function getLifePlanApiOrigin(): string {
  return new URL(BASE_API_URL ?? 'http://localhost:4000/api/v1').origin;
}
