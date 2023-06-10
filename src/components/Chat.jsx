import React from "react";
import io from 'socket.io-client';
import { useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import styles from '../styles/Chat.module.css';
import Messages from "./Messages";

const socket = io.connect('http://localhost:5500');

const Chat = () => {
    const { search } = useLocation();
    const navigate =useNavigate();
    const [params, setParams] = useState({room: '', user: ''});
    const [state, setState] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState(0);

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search));
        setParams(searchParams);
        socket.emit('join', searchParams);
    }, [search])

    useEffect( () => {
        socket.on('message', ({data}) => {
            setState((_state) =>  [..._state, data ]);
        });
    }, []);

    useEffect( () => {
        socket.on('room', ({data: {users}}) => {
            setUsers(users.length);
        });
    }, []);

    const leftRoom = () => {
        socket.emit('leftRoom', { params });
        navigate('/');
    };
    const handleChange = ({ target: {value} }) => setMessage(value);
    const handleSubmit = (e) => {
        e.preventDefault();

        if(!message) return;

        socket.emit('sendMessage', { message, params });

        setMessage('');
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <div className={styles.title}>{params.room}</div>
                <div className={styles.users}>участников: {users} </div>
                <button className={styles.left} onClick={leftRoom}>
                    Покинуть комнату
                </button>
            </div>

            <div className={styles.messages}>
                <Messages messages={state} name={params.name} />
            </div>    

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.input}>
                    <input 
                        type="text"
                        name="message"
                        value={message}
                        placeholder="Напишите сообщение..."
                        onChange={handleChange}
                        autoComplete="off"
                        required
                    />
                </div>

                <div className={styles.button}>
                    <input type="submit" onSubmit={handleSubmit} value="Отправить" />
                </div>
            </form>


        </div>
    );
};

export default Chat;