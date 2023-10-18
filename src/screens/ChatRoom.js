import React, { useState, useEffect } from 'react';
import { Text, View, ImageBackground, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import ChatMessage from '../components/ChatMessage';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/Entypo'



let chatRoomId = null
function ChatRoom(props) {
    const { user } = useSelector(state => state.user)
    const { seller } = props.route.params
    const [message, setMessage] = useState('')
    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState([])
    const [chatId, setChatId] = useState('')
    const [documentBlob, setDocumentBlob] = useState('')

    useEffect(() => {
        chatRoomId = user.id > seller.id ? user.id + '-' + seller.id : seller.id + '-' + user.id
        getMessages(chatRoomId)
    }, [])

    const createChatRoom = async (id) => {
        fetch(`http://146.190.205.245/api/collections/chatrooms_opinion/records`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                _id: id,
                messages: []
            })
        }).then(
            res => res.json())
            .then((res) => {
                if (res.messages) {
                    setChatId(res.id)
                    setMessages(res.messages)
                }
            }
            )
            .catch(err => console.log(err))
    }

    const updateChatroom = (messageId) => {
        fetch(`http://146.190.205.245/api/collections/chatrooms_opinion/records/${chatId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                messages: [...messages, messageId]
            })
        }).then(res => res.json())
            .then(res => {
                setMessages(res.messages)
                console.log("Message Sent")
            }).catch(err => console.log("Fetch Error: ", err))
    }


    const getMessages = async (id) => {
        fetch(`http://146.190.205.245/api/collections/chatrooms_opinion/records?filter=(_id='${id}')`, {
            method: "GET",
        }).then(
            res => res.json())
            .then((res) => {
                console.log(res, 'mil')
                if (res.totalItems === 0) {
                    createChatRoom(id)
                }
                else if (res.items[0].messages) {
                    setChatId(res.items[0].id)
                    setMessages(res.items[0].messages)
                }
            }
            )
            .catch(err => console.log(err))
    }

    const sendMessage = async () => {
        fetch(`http://146.190.205.245/api/collections/messages_opinion/records`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                receiver: seller.id,
                sender: user.id,
                type: 'text',
                text: message
            })
        }).then(
            res => res.json())
            .then((res) => {
                //console.log(res)
                if (res.text) {
                    updateChatroom(res.id)
                }
                setMessage('')
            }
            )
            .catch(err => console.log(err))
    }



    const handleSend = () => {
        if (message) {
            sendMessage()
        }
        else {
            console.warn("Microphone")
        }
    }

    return (
        <View style={{ backgroundColor: '#50C878', flex: 1, paddingTop: 10 }}>
            <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1 }}>
                <KeyboardAvoidingView
                    keyboardVerticalOffset={60}>
                    <ImageBackground style={{ width: '100%', height: '100%' }} source={{ uri: "https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg" }}>
                        <FlatList
                            inverted={-1}
                            contentContainerStyle={{ flexDirection: 'column-reverse' }}
                            data={messages}
                            renderItem={({ item }) => <ChatMessage id={item} currentUser={user.id} name={seller.name} />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ paddingBottom: 8, flexDirection: "row", marginTop: 0 }}>
                            <View style={{ width: "78%", flex: 1, borderRadius: 45, marginHorizontal: 10, backgroundColor: "white", padding: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#50C878', }}>
                                <Icon
                                    style={{ paddingLeft: 10 }}
                                    name="happy-outline"
                                    size={30}
                                    color="grey"
                                />
                                <TextInput style={{ flex: 1, paddingLeft: 10 }} multiline value={message} onChangeText={(value) => setMessage(value)} />
                                {/* {!message && <Icon
                            onPress={() => { }}
                            name="camera"
                            size={30}
                            color="grey"
                        />} */}
                                {/* <Icon2
                            style={{ paddingLeft: 10, paddingRight: 5 }}
                            onPress={() => getDocument()}
                            name="attachment"
                            size={25}
                            color="grey"
                        /> */}
                            </View>
                            {message && <TouchableOpacity style={{ backgroundColor: "#50C878", justifyContent: "center", height: 60, width: '15%', borderRadius: 50, alignItems: "center", marginRight: 8 }} onPress={() => handleSend()}>

                                <Icon
                                    name="send"
                                    size={24}
                                    color="white" />
                                {/* // <Icon
                            //     name="mic"
                            //     size={25}
                            //     color="white" /> */}


                            </TouchableOpacity>}
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

export default ChatRoom;
