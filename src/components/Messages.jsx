import React from "react";

import styles from '../styles/Messages.module.css';


const Messages = ({messages, name}) => {
    return (
        <div className={styles.messages}>
            {messages.map(({user, message}, i) => {
                const isServer = user.name.trim().toLowerCase() === 'сервер';
                const itsMe = user.name.trim().toLowerCase() === name.trim().toLowerCase();
                let className = itsMe ? styles.me : styles.user;
                if (isServer) {
                    className = styles.server
                }
                

                return(  
                    <div key={i} className={`${styles.message} ${className}`} >
                        <span className={styles.user}>{user.name}</span>

                        <div className={styles.text}>{message}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default Messages