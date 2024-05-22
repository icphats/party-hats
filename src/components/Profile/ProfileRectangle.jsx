import Connect from "../../containers/Connect"
import { AccountContext } from "../../context/AccountContext"
import { useContext } from "react"

const ProfileRectangle = () => {

    const {
        alert,
        confirm,
        login,
        loader,
        appState,
        remove
    } = useContext(AccountContext)

    console.log(appState)

    return (
        <div className="profile-rectangle-container">
            {appState === 0 ? (
                <Connect alert={alert} confirm={confirm} login={login} loader={loader} />
            ) : (
                ''
            )}
            {appState === 1 ? (
                <>locked</>
                // <Unlock alert={alert} confirm={confirm} login={login} remove={remove} loader={loader} />
            ) : (
                ''
            )}
            {appState === 2 ? (
                <>logged in</>
                // <Wallet alert={alert} confirm={confirm} logout={logout} remove={remove} loader={loader} />
            ) : (
                ''
            )}
        </div>
    )
}

export default ProfileRectangle