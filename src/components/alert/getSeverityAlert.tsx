import { AlertColor } from "@mui/material";

const getSeverityAlert = (
  type?: string
): AlertColor => {

  switch (type) {
    case 'load':
      return "warning";
    case 'warning':
      return "warning";
    case 'save':
      return "success";
    case 'success':
      return "success";
    default:
      return "error";
  }

}

export default getSeverityAlert;