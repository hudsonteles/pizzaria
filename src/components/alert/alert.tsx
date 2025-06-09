import { Component } from "react";
import Swal, { SweetAlertPosition } from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import getSeverityAlert from "./getSeverityAlert";


class Alert extends Component {

    showAlert(data: {
        type?: 'load' | 'warning' | 'error' | 'success' | 'save',
        message?: HTMLElement | any,
        position?: SweetAlertPosition,
        timer?: number,
        timerProgressBar?: boolean
    }): void {

        const swal = withReactContent(Swal);

        swal.fire({
            icon: getSeverityAlert(data.type),
            title: data.message,
            toast: true,
            position: data.position ? data.position : 'bottom-start',
            showConfirmButton: false,
            showCloseButton: true,
            timer: data.timer ? data.timer : 3000,
            timerProgressBar: data.timerProgressBar ? data.timerProgressBar : true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            },
            didClose: () => {
                Swal.close
            }
        })
    }

}

export default Alert
