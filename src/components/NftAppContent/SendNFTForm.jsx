/* global BigInt */
import { React, useState, useEffect } from "react";
import extjs from "../../ic/extjs.js";
import { StoicIdentity } from "../../ic/identity.js";
import { useSelector } from "react-redux";
import { validatePrincipal } from "../../ic/utils.js";

export default function SendNFTForm(props) {
  const addresses = useSelector((state) => state.addresses);
  const principals = useSelector((state) => state.principals);
  const currentPrincipal = useSelector((state) => state.currentPrincipal);
  const currentAccount = useSelector((state) => state.currentAccount);
  const identity = useSelector((state) =>
    state.principals.length ? state.principals[currentPrincipal].identity : {}
  );

  const [step, setStep] = useState(0);
  const [to, setTo] = useState("");

  const { setAlertOpen, setAlertTitle, setAlertMessage } = props;

  const error = (e) => {
    setAlertTitle(e);
    setAlertMessage(e);
    setAlertOpen(true);
  };
  const review = () => {
    const validationResult = validatePrincipal(to);
    if (!validationResult) return error("Not a valid Principal");
    if (!to) return error("Please enter a Principal ID");
    setStep(1);
  };
  const submit = async () => {
    var _from_principal = identity.principal;
    var _from_sa = currentAccount;
    var _to_user = to;
    var _amount = BigInt(1);
    var _fee = BigInt(0);
    var _memo = "";
    var _notify = false;
    const id = StoicIdentity.getIdentity(identity.principal);
    if (!id)
      return error("Something wrong with your wallet, try logging in again");
    try {
      let r = await extjs
        .connect("https://icp0.io/", id)
        .token(props.pid, "ext")
        .transfer(
          _from_principal,
          _from_sa,
          _to_user,
          _amount,
          _fee,
          _memo,
          _notify
        );
      if (r !== false) {
        props.closeModal();
        console.log(
          "Transaction complete",
          "Your transfer was sent successfully"
        );
      } else {
        error("Something went wrong with this transfer");
      }
    } catch (e) {
      error("There was an error: " + (e.message || e));
    }
  };

  return (
    <>
      <div className="send-nft-container">
        {/* <div>Send NFT</div> */}
        {step === 0 ? (
          <>
            <img
              height={"60px"}
              src={`./assets/phats/${props.pid}.png`}
              alt=""
            />
            <div>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Principal ID"
              />
            </div>
          </>
        ) : (
          <>
            <div style={{ color: "red" }}>All transactions are final!</div>
            <img
              height={"60px"}
              src={`./assets/phats/${props.pid}.png`}
              alt=""
            />

            <div style={{ fontSize: "12px" }}>To: {to}</div>
          </>
        )}
        <div>
          {step === 0 ? (
            <button className="send-nft-button" onClick={review}>
              Review
            </button>
          ) : (
            <button className="send-nft-button" onClick={submit}>
              Confirm
            </button>
          )}
        </div>
      </div>
    </>
  );
}
