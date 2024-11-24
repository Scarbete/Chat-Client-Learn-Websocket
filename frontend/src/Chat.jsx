import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'

const socket = io('http://localhost:4000')

const Chat = () => {
    const [message, setMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    const [username, setUsername] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const sendMessage = () => {
        if (message.trim() !== '') {
            const messageData = {
                author: username,
                message: message,
                time: new Date().toLocaleTimeString(),
            }

            socket.emit('send_message', messageData)
            setMessage('')
        }
    }

    useEffect(() => {
        socket.on(
            'receive_message',
            (data) => setMessageList((prev) => [...prev, data])
        )
    }, [])

    return (!isLoggedIn) ? (
        <div>
            <h2>Введите имя пользователя:</h2>
            <input
                type={'text'}
                placeholder={'Имя пользователя'}
                onChange={({ target }) => setUsername(target.value)}
            />
            <button onClick={() => setIsLoggedIn(true)}>Войти</button>
        </div>
    ) : (
        <div>
            <h2>Добро пожаловать в чат, {username}!</h2>
            <div style={{border: '1px solid #ccc', padding: '10px', marginBottom: '10px', height: '300px', overflowY: 'auto'}}>
                {messageList.map((msg, index) => (
                    <div key={index}>
                        <p>
                            <strong>{msg.author}:</strong> {msg.message} <span>{msg.time}</span>
                        </p>
                    </div>
                ))}
            </div>
            <input
                type={'text'}
                value={message}
                onChange={({ target }) => setMessage(target.value)}
                placeholder={'Введите сообщение...'}
            />
            <button onClick={sendMessage}>Отправить</button>
        </div>
    )
}

export default Chat
