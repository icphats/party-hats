import React, { useEffect, useState, useCallback } from "react";
import { PiOptionBold } from "react-icons/pi";
import { PiHouseBold } from "react-icons/pi";
import SendNFTForm from "./SendNFTForm";
import { useModal } from "../../context/DefaultModal";

function UserOwnedNftButton(props) {
  const { pid } = props;
  const {
    openModal,
    closeModal,
    setModalContent,
    modalIsOpen,
    setAlertOpen,
    setAlertTitle,
    setAlertMessage,
    setAlertButtonLabel,
    setAlertHandler,
  } = useModal();

  const [step, setStep] = useState(0);

  const getModalContent = () => {
    let content;
    switch (step) {
      case 0:
        content = (
          <>
            <button
              className="default-modal-button"
              onClick={() => handleStepsButton()}
            >
              Send
            </button>
            <button className="default-modal-button" onClick={() => setStep(1)}>
              Stake
            </button>
            <button className="default-modal-button" onClick={() => setStep(1)}>
              El Savidore
            </button>
            <button className="default-modal-button" onClick={() => setStep(1)}>
              Theodore
            </button>
          </>
        );
        break;
      case 1:
        content = (
          <>
            <SendNFTForm
              pid={pid}
              closeModal={closeModal}
              setAlertOpen={setAlertOpen}
              setAlertTitle={setAlertTitle}
              setAlertMessage={setAlertMessage}
            />
            <button className="default-modal-button" onClick={() => setStep(0)}>
              <PiHouseBold />
            </button>
          </>
        );
        break;
      default:
        content = false;
        break;
    }
    return content;
  };

  const handleStepsButton = () => {
    setStep((prev) => prev + 1);
    setModalContent(getModalContent());
  };

  const handleNftOnClick = () => {
    setModalContent(getModalContent());
    openModal();
  };

  useEffect(() => {
    setModalContent(getModalContent());
  }, [step]);

  useEffect(() => {
    if (!modalIsOpen) setStep(0);
  }, [modalIsOpen]);

  return (
    <>
      <button onClick={() => handleNftOnClick()} className="send-now-container">
        {/* <PiOptionBold /> */}
        {pid.slice(0, 3)}
      </button>
    </>
  );
}

export default UserOwnedNftButton;
