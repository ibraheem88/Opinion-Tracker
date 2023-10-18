import React, { useState, useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/Ionicons'


export default function ChatMessage(props) {

    const [sender, setSender] = useState('');
    const [message, setMessage] = useState({});
    const [image, setImage] = useState('https://lh3.googleusercontent.com/proxy/n8DBYcGSsu1kooWk6BV00MQXpl7scmyvwlIDsgzcP72YADw8R5GW0RI-zgCTu3e19LrunYEk73uWA86YjeHNv0MVIg');
    const [document, setDocument] = useState(undefined);

    const getMessage = async (text) => {
        //setLoading(true);
        fetch(`http://146.190.205.245/api/collections/messages_opinion/records/${props.id}`, {
            method: "GET",
        }).then(res => res.json())
            .then(res => {
                console.log(res)
                setMessage(res)
            }).catch(err => console.log("Fetch Error: ", err))
    }


    useEffect(() => {
        getMessage();
    }, [])


    const isMyMessage = () => {
        return props.currentUser === message?.sender
    }

    return (
        message.text && <View style={{ padding: 10, paddingHorizontal: 16 }}>
            {message?.type !== 'text' ? (
                <View
                    style={[
                        { paddingHorizontal: 4, paddingVertical: 3, borderRadius: 5 },
                        isMyMessage()
                            ? {
                                backgroundColor: '#DCF8C5',
                                alignSelf: 'flex-end',
                                marginLeft: 60,
                            }
                            : {
                                backgroundColor: 'white',
                                marginRight: 60,
                                alignSelf: 'flex-start',
                            },
                    ]}>
                    {!isMyMessage() && (
                        <Text style={{ color: '#50C878', fontWeight: 'bold' }}>
                            {message?.sender}
                        </Text>
                    )}
                    {message?.type === 'image' ?
                        <Image
                            source={{ uri: "http://10.113.60.188:5000/upload/messages/" + message?.image }}
                            style={{ width: 280, height: 280, marginVertical: 2 }}
                        /> :
                        <View style={{ flexDirection: "row", marginTop: 7, alignItems: "center" }}>
                            <Icon
                                name="document-text-outline"
                                size={24}
                                color="black" />
                            <Text style={{ marginTop: 5, marginHorizontal: 5 }}>{message?.name}</Text>
                            {document &&
                                (<Icon
                                    name="download-outline"
                                    onPress={() => downloadDocument()}
                                    size={24}
                                    color="blue" />)
                            }
                        </View>
                    }
                    <Text style={{ fontSize: 14 }}>
                        {message?.text}
                    </Text>
                    <Text style={{ alignSelf: 'flex-end', color: 'grey', fontSize: 14 }}>
                        {moment(message?.created).fromNow()}
                    </Text>
                </View>
            ) : (
                <View
                    style={[
                        { padding: 8, paddingVertical: 5, borderRadius: 5 },
                        isMyMessage()
                            ? {
                                backgroundColor: '#50C878',
                                alignSelf: 'flex-end',
                                marginLeft: 60,
                            }
                            : {
                                backgroundColor: 'white',
                                marginRight: 60,
                                alignSelf: 'flex-start',
                            },
                    ]}>
                    {!isMyMessage() && (
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>
                            {props.name}
                        </Text>
                    )}
                    <Text style={{ marginTop: 5, color: !isMyMessage() ? 'black' : 'white' }}>{message?.text}</Text>
                    <Text style={{ alignSelf: 'flex-end', color: !isMyMessage() ? 'black' : 'white', fontSize: 14 }}>
                        {moment(message?.created).format("hh:mm A dddd")}
                    </Text>
                </View>
            )}
        </View>

    )
}