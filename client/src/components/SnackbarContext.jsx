import React, { createContext, useContext, useCallback, useState } from "react";
import { Message } from "rsuite";
import { AnimatePresence, motion } from "framer-motion";

const SnackbarContext = createContext();

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context)
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  return context;
};

export const SnackbarProvider = ({ children }) => {
  const [snackbars, setSnackbars] = useState([]);

  const showSnackbar = useCallback(
    (message, type = "info", duration = 3000) => {
      const id = Date.now();
      setSnackbars((prev) => [...prev, { id, message, type, duration }]);

      setTimeout(() => {
        setSnackbars((prev) => prev.filter((snack) => snack.id !== id));
      }, duration);
    },
    []
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
        }}
      >
        <AnimatePresence>
          {snackbars.map((snack) => (
            <motion.div
              key={snack.id}
              initial={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 20 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: 10 }}
            >
              <Snackbar message={snack.message} type={snack.type} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SnackbarContext.Provider>
  );
};

const Snackbar = ({ message, type }) => (
  <div style={{ minWidth: 250 }}>
    <Message type={type} showIcon bordered>
      {message}
    </Message>
  </div>
);
