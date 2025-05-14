// src/context/SnackbarContext.jsx
import  { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";


const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
    duration: 4000,
  });

  const showSnackbar = useCallback((message, severity = 'info', duration = 4000) => {
    setSnackbar({ open: true, message, severity, duration });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.duration}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};


