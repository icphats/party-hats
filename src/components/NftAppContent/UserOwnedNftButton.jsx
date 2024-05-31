import React from "react";
import { PiOptionBold } from "react-icons/pi";
import SendNFTForm from "./SendNFTForm";
import { useModal } from "../../context/DefaultModal";

function UserOwnedNftButton({ pid }) {
  const { openModal, setModalContent } = useModal();

  const nftForm = <SendNFTForm pid={pid} />;

  const handleUserNftModal = () => {
    setModalContent(nftForm);
    openModal();
  };

  return (
    <>
      <button onClick={handleUserNftModal} className="send-now-container">
        <PiOptionBold />
      </button>
    </>
  );
}

export default UserOwnedNftButton;
