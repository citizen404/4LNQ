import React from 'react'
import Button from "../Button/Button"
import {useTelegram} from "../../hooks/useTelegram"

const Header = () => {
    const { user, onClose} = useTelegram()
    return (
        <div className={'header'}>
            <Button onClick={onClose}>Close</Button>
            <span className={'username'}>
                {user?.username}
                {user?.id}
            </span>
        </div>
    )
}
export default Header;