import { useNotifications } from '@/components/ui/notifications';
import ky, { Options } from 'ky';

import { getFirebaseToken } from './firebase-auth-service';

type NotificationType = 'error' | 'success' | 'warning' | 'info';

type ApiRequestOptions<T = unknown> = Options & {
  json?: T;
};

export const api = ky.create({
  prefixUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  timeout: 60000,
  credentials: 'include',
  hooks: {
    beforeRequest: [
      async request => {
        request.headers.set('Accept', 'application/json');

        const token = await getFirebaseToken();

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_, __, response) => {
        return response;
      },
    ],
  },
});

export const apiRequest = async <ResponseType = unknown, RequestBodyType = unknown>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options?: ApiRequestOptions<RequestBodyType>,
): Promise<ResponseType> => {
  try {
    return await api[method](url, options).json<ResponseType>();
  } catch (error) {
    if (error instanceof Error) {
      useNotifications.getState().addNotification({
        type: 'error' as NotificationType,
        title: 'Error',
        message: error.message,
      });
    }

    throw error;
  }
};

export const apiGet = <ResponseType = unknown>(url: string, options?: ApiRequestOptions) =>
  apiRequest<ResponseType>('get', url, options);

export const apiPost = <ResponseType = unknown, RequestBodyType = unknown>(
  url: string,
  options?: ApiRequestOptions<RequestBodyType>,
) => apiRequest<ResponseType, RequestBodyType>('post', url, options);

export const apiPut = <ResponseType = unknown, RequestBodyType = unknown>(
  url: string,
  options?: ApiRequestOptions<RequestBodyType>,
) => apiRequest<ResponseType, RequestBodyType>('put', url, options);

export const apiPatch = <ResponseType = unknown, RequestBodyType = unknown>(
  url: string,
  options?: ApiRequestOptions<RequestBodyType>,
) => apiRequest<ResponseType, RequestBodyType>('patch', url, options);

export const apiDelete = <ResponseType = unknown>(url: string, options?: ApiRequestOptions) =>
  apiRequest<ResponseType>('delete', url, options);
