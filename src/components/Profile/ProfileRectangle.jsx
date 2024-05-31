import Connect from "../../containers/Connect";
import { AccountContext } from "../../context/AccountContext";
import { useContext } from "react";
import Unlock from "../../containers/Unlock";
import Wallet from "../../containers/Wallet";

const ProfileRectangle = (props) => {
  const { alert, confirm, login, loader, appState, logout, remove } =
    useContext(AccountContext);

  return (
    <div
      className={`profile-rectangle-container${
        appState == 2 ? "-logged-in" : ""
      }`}
    >
      {appState === 0 ? (
        <Connect
          alert={alert}
          confirm={confirm}
          login={login}
          loader={loader}
        />
      ) : (
        ""
      )}
      {appState === 1 ? (
        <Unlock
          alert={alert}
          confirm={confirm}
          login={login}
          remove={remove}
          loader={loader}
        />
      ) : (
        ""
      )}
      {appState === 2 ? (
        <Wallet
          alert={alert}
          confirm={confirm}
          logout={logout}
          remove={remove}
          loader={loader}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProfileRectangle;
