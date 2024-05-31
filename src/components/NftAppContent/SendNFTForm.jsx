/* global BigInt */
import React from "react";
import extjs from "../../ic/extjs.js";
import { StoicIdentity } from "../../ic/identity.js";
import { useSelector } from "react-redux";

export default function SendNFTForm(props) {
  const addresses = useSelector((state) => state.addresses);
  const principals = useSelector((state) => state.principals);
  const currentPrincipal = useSelector((state) => state.currentPrincipal);
  const currentAccount = useSelector((state) => state.currentAccount);
  const identity = useSelector((state) =>
    state.principals.length ? state.principals[currentPrincipal].identity : {}
  );

  const [step, setStep] = React.useState(0);

  const [to, setTo] = React.useState("");
  const [canister, setCanister] = React.useState("");
  const [contacts, setContacts] = React.useState([]);

  const error = (e) => {
    props.error(e);
  };
  const review = () => {
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

  React.useEffect(() => {
    if (props.pid) setCanister(extjs.decodeTokenId(props.pid).canister);
    else setCanister("");
    var contacts = [];
    principals.forEach((p) => {
      p.accounts.forEach((a) => {
        contacts.push({
          group: p.identity.principal,
          name: a.name,
          address: a.address,
        });
      });
    });
    setContacts(contacts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.pid]);

  return (
    <>
      <div>
        <div style={{ textAlign: "center" }}>Send NFT</div>
        {step === 0 ? (
          <div>
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                marginTop: 10,
              }}
            >
              Please enter the recipient address and amount that you wish to
              send below.
            </div>
            <div>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Address of the Recipient"
                style={{
                  width: "100%",
                  padding: "8px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: "center" }}>
              Please confirm that you are about to send NFT <br />
              <strong style={{ color: "red" }}>{props.pid}</strong>
              <br />
              to <strong style={{ color: "red" }}>{to}</strong>
            </div>
            <div style={{ textAlign: "center" }}>
              <strong>
                All transactions are irreversible, so ensure the above details
                are correct before you continue.
              </strong>
            </div>
          </div>
        )}
        <div style={{ textAlign: "right", padding: "8px" }}>
          <button style={{ marginRight: "8px" }}>Cancel</button>
          {step === 0 ? (
            <button onClick={review}>Review Transaction</button>
          ) : (
            <button onClick={submit}>Confirm Transaction</button>
          )}
        </div>
      </div>
    </>
  );
}
