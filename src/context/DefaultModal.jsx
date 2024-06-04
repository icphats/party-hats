import React, { createContext, useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import AlertDialog from "../components/AlertDialog";
import "../styles/default-modal.css";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [step, setStep] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertButtonLabel, setAlertButtonLabel] = useState("close");
  const handleDialogClose = () => {
    console.log("clicked");
    setAlertOpen(false);
    setAlertTitle("");
    setAlertMessage("");
    setAlertButtonLabel("");
  };
  const [alertHandler, setAlertHandler] = useState(() => handleDialogClose);

  let subtitle;

  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(false);
  };

  const contextValue = {
    setModalContent,
    modalIsOpen,
    openModal,
    afterOpenModal,
    closeModal,
    setSubtitleRef: (ref) => (subtitle = ref),
    setAlertOpen,
    setAlertTitle,
    setAlertMessage,
    setAlertButtonLabel,
    setAlertHandler,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="default-modal-container"
        overlayClassName="custom-modal-overlay"
      >
        {modalContent}
        <AlertDialog
          open={alertOpen}
          title={alertTitle}
          message={alertMessage}
          buttonLabel={alertButtonLabel}
          handler={alertHandler}
        />
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");
