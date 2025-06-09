import { Typography } from "@mui/material";
import axios from "axios";
import { signOut } from "next-auth/react";
import Swal, { SweetAlertIcon } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const api = (
    token: string | null = null,
    version : string | null = 'v1',
    fullUrl : string | null = null
) => {

    const swal = withReactContent(Swal);

    const urls = {
        test: '',
        development: `${process.env.BASE_URL_LOCAL}/api/${version}`,
        production: `${process.env.BASE_URL}/api/${version}`
    }

    const api = axios.create({
        baseURL: fullUrl ? `${urls[process.env.NODE_ENV].split('/api')[0]}${fullUrl}` : `${urls[process.env.NODE_ENV]}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        }
    })

    if (token) {
        api.interceptors.request.use((config) => {
            if (config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        });
    }

    const showError = async (
        title: string,
        text= `Não foi possível completar a ação.\nDesculpe o transtorno, entre em contato conosco para sanarmos o problema.`,
        icon: SweetAlertIcon | undefined =  'error'
    ) => {
        await swal.fire({
            title:
                <Typography
                    variant="h5"
                >
                    {title}
                </Typography>,
            html:
                <Typography
                    variant="h5"
                >
                    {text}
                </Typography>,
            icon: icon,
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                swal.getConfirmButton()?.focus();
            }
        });
        swal.close();
    }

    const returnError = (error: any) => {
        return new Promise((_resolve, reject) => {
            reject(error);
        })
    }

    api.interceptors.response.use(
        (response) => Promise.resolve(response),
        async (error) => {
            const status = error?.response?.status;
            const data = error?.response?.data;

            if (status === 401 || status === 419) {
                await showError(
                    "Sessão expirada",
                    "Sua sessão expirou ou você não está autenticado. Por favor, faça login novamente.",
                    "warning"
                );
                signOut({ callbackUrl: "/auth/login" });
                return returnError(error);
            }

            if (status === 400) {
                return returnError(error);
            }

            if (status === 403) {
                await showError(
                    data?.error || "Acesso negado",
                    data?.message || "Você não tem permissão para acessar este recurso."
                );
            } else if (status === 404) {
                if (
                    data?.message?.includes('No query results for model') ||
                    data?.error?.includes('NOT_FOUND')
                ) {
                    return returnError(error);
                }
                await showError("Ops... Essa rota não existe");
            } else if (status === 406) {
                await showError(
                    data?.error || "Não aceito",
                    data?.message,
                    data?.icon || "error"
                );
            } else if (status === 422) {
                return returnError(error);
            } else if (status === 429) {
                await showError(
                    'Muitas solicitações',
                    'Você extrapolou o limite de requisições do sistema'
                );
            } else if (status === 500) {
                await showError(
                    `Ops... Aconteceu alguma coisa interna!`
                );
            } else {
                await showError(
                    `Ops... Erro desconhecido!`
                );
            }

            return returnError(error);
        }
    )

    return api;
}

export default api;
