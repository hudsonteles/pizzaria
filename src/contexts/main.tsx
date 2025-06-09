'use client'

import Alert from "@/components/alert/alert";
import moment, { Moment } from "moment";
import { useRouter } from "next/navigation";
import { ReactNode, createContext, useContext } from "react";
import Swal from "sweetalert2";
import withReactContent, { ReactSweetAlert, SweetAlert2 } from "sweetalert2-react-content";

const MainContext = createContext({} as {
    format: string;
    today: () => Moment;
    isToday: (date: Moment) => boolean;
    swal: SweetAlert2 & ReactSweetAlert;
    catchError: (e?: any | null, formik?: any | null) => Promise<void>;
    handleBack: (url: string) => void;
})

type Props = {
    children: ReactNode;
};

export const MainProvider = ({ children }: Props) => {

    const router = useRouter();
    const swal = withReactContent(Swal);

    const format = "YYYY-MM-DD";

    const today = () => {
        return moment(new Date());
    }

    const isToday = (date: Moment) => {
        return today().format(format) === date?.format(format)
    }

    const catchError = async (e: any = null, formik: any = null) => {

        if (e && e.response) {
            const status = e.response.status;
            const data = e.response.data;

            if (status === 422) {
                if (formik) {
                    formik.setErrors(data.errors);
                } else {
                    new Alert({}).showAlert({
                        type: 'error',
                        message: data.message || "Erro de validação."
                    });
                }
                return;
            }

            if (status === 403) {
                router.replace('/home');
                return;
            }

            // Outros status podem ser tratados aqui, se necessário
            new Alert({}).showAlert({
                type: 'error',
                message: data?.message || "Ocorreu um erro inesperado. Tente novamente."
            });
            return;
        }
    }

    const handleBack = (url: string) => {
        // Verificar se o histórico de navegação permite retornar
        if (document.referrer.startsWith(window.location.origin)) {
          router.back();
        } else {
          router.replace(url); // Redirecionar para a URL específica
        }
      };

    return (
        <MainContext.Provider
            value={{
                today,
                format,
                isToday,
                catchError,
                swal,
                handleBack
            }}
        >
            {children}
        </MainContext.Provider>
    )
}

export const useMain = () => useContext(MainContext)
