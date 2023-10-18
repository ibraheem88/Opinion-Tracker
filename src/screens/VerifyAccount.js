import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { setUserInfo } from '../state/actions/userActions';
import { useSelector, useDispatch } from 'react-redux';

const VerifyAccount = ({ navigation }) => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    console.log(user.email)
    const [loading, setLoading] = useState(false)
    const [token, setToken] = useState('')
    const [submitToken, setSubmitToken] = useState(false)

    const handleSubmit = async () => {
        setLoading(true);
        await fetch("http://146.190.205.245/api/collections/users_opinion/request-verification", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "email": user.email
            })
        }).then(res => res.text())
            .then(res => {
                setLoading(false);
                setSubmitToken(true);
            }).catch(err => { console.log("Fetch Error: ", err); setLoading(false) })
    }

    const updateUser = () => {
        fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.id}`, {
            method: "GET"
        }).then(res => res.json())
            .then((res) => {
                setToken('')
                dispatch(setUserInfo({ token: user.token, email: user.email, ...res }))
                Alert.alert("", "Account Verified Successfully", [{
                    text: 'Ok',
                    onPress: () => navigation.goBack(),
                }])
            }).catch((err) => {
                console.log(err)
            })
    }

    const verifyAccount = () => {
        setLoading(true);
        fetch("http://146.190.205.245/api/collections/users_opinion/confirm-verification", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "token": token
            })
        }).then(res => res.text())
            .then(res => {
                setLoading(false);
                if (res.length === 0) {
                    updateUser();
                }
            }).catch(err => { console.log("Fetch Error: ", err); setLoading(false) })
    }

    return (<View style={[styles.container]}>
        <View style={[{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1, backgroundColor: 'white', paddingHorizontal: 20, paddingTop: 50 }, user.verified && { paddingTop: 0 }]}>
            {user.verified ? <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <Text style={[styles.title, { marginBottom: 20, fontWeight: 'bold', fontSize: 28 }]}>Account Verified!</Text>
                <Icon name='verified' size={44} color='green' style={{}} />
            </View> : !submitToken ?
                <><Text style={[styles.title, { marginBottom: 20 }]}>REQUEST VERIFICATION</Text>
                    <View style={styles.shadow}>
                        <TextInput
                            style={styles.input}
                            editable={false}
                            placeholder="Email"
                            keyboardType="email-address"
                            placeholderTextColor={"black"}
                            autoCapitalize="none"
                            value={user.email}
                        />
                        <Icon name='email' size={22} style={{ position: 'absolute', left: 10 }} color="black" />
                    </View>
                    <TouchableOpacity
                        disabled={loading}
                        style={[styles.button, { marginTop: 0, alignSelf: 'stretch' }]}
                        onPress={() => handleSubmit()}>{loading ? (
                            <ActivityIndicator size={18} color="white" />
                        ) : (<Text style={styles.buttonText}>Submit</Text>)}
                    </TouchableOpacity></> : <><Text style={{ color: '#50C878', marginBottom: 20, fontSize: 18 }}>Use the code sent to your email</Text>
                    <View style={styles.shadow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Code"
                            onChangeText={(t) => setToken(t)}
                            placeholderTextColor={"black"}
                            autoCapitalize="none"
                            value={token}
                        />
                        <Icon name='enhanced-encryption' size={22} style={{ position: 'absolute', left: 10 }} color="black" />
                    </View>
                    <TouchableOpacity
                        disabled={loading}
                        style={[styles.button, { marginTop: 0, alignSelf: 'stretch' }]}
                        onPress={() => verifyAccount()}>{loading ? (
                            <ActivityIndicator size={18} color="white" />
                        ) : (<Text style={styles.buttonText}>Verify</Text>)}
                    </TouchableOpacity></>}
        </View>
    </View>
    )
}

export default VerifyAccount;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#50C878', flex: 1,
        paddingTop: 10
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        alignSelf: 'center',
        color: '#50C878',
    },
    input: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingLeft: 40,
        paddingVertical: 15,
        color: 'black',
    },
    shadow: {
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        width: '100%',
        marginBottom: 35,
        elevation: 12,
        shadowColor: 'black',
    },
    button: {
        backgroundColor: '#50C878',
        borderRadius: 25,
        alignSelf: 'center',
        paddingHorizontal: 60,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    }
})
