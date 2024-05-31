import React, { createContext, useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles/default-modal.css";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  let subtitle;

  const openModal = () => {
    setIsOpen(true);
  };

  const afterOpenModal = () => {};

  const closeModal = () => {
    setIsOpen(false);
  };

  const contextValue = {
    setModalContent,
    modalIsOpen,
    openModal,
    afterOpenModal,
    closeModal,
    setSubtitleRef: (ref) => (subtitle = ref),
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
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");
