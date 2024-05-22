import Connect from "../../containers/Connect"
import { AccountContext } from "../../context/AccountContext"
import { useContext } from "react"

const ProfileRectangle = () => {
    
    const {
        alert,
        confirm,
        login,
        loader
    } = useContext(AccountContext)

    return (
        <div className="profile-rectangle-container">
            <Connect alert={alert} confirm={confirm} login={login} loader={loader} />
        </div>
    )
}

export default ProfileRectangle