import "./index.css"

function Navbar({handleTabs}) {
    return (
        <div className="navbar-container">
            <button onClick={() => handleTabs(0)}>Home Room</button>
            <button onClick={() => handleTabs(1)}>Party Room</button>
        </div>
    )
    
}

export default Navbar;