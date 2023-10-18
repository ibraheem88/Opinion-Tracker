import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'

const ResetPassword = ({ navigation }) => {

    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfimPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = () => {
        if (!(newPassword.length >= 8 && confirmPassword.length >= 8)) {
            Alert.alert("", 'Password length must be 8 atleast')
            return
        }
        setLoading(true);
        fetch(`http://146.190.205.245/api/collections/users_opinion/confirm-password-reset`, {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                "token": code,
                "password": newPassword,
                "passwordConfirm": confirmPassword
            })
        }).then(res => {
            console.log(res.status)
            if (res.status === 204) {
                return res.text()
            } else {
                return res.json()
            }
        })
            .then((res) => {
                console.log(res)
                if (res.length == 0) {
                    Alert.alert("", "Password Changed Successfully", [{
                        text: 'Ok',
                        onPress: () => navigation.goBack(),
                    }])
                } else {
                    const keys = Object.keys(res.data)
                    console.log(res.data)
                    const err = res.data[keys[0]].message
                    Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
                }
                setLoading(false);
            }).catch(err => { console.log("Fetch Error: ", err); setLoading(false) })
    }


    return (
        <View style={{ backgroundColor: '#50C878', flex: 1 }}>
            <Image
                style={styles.logo}
                source={require('../assets/logoHeader.jpg')} />
            <View style={styles.container}>
                <View style={styles.body}>
                    <Text style={styles.inputLabel}>Code</Text>
                    <View style={styles.shadow}>
                        <TextInput style={styles.input} value={code} onChangeText={setCode} />
                        <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} />
                    </View>
                    <Text style={styles.inputLabel}>NEW PASSWORD</Text>
                    <View style={styles.shadow}>
                        <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry={!visible} />
                        <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} />
                        <Icon2 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
                            onPress={() => setVisible(!visible)} />
                    </View>
                    <Text style={styles.inputLabel}>CONFRIM PASSWORD</Text>
                    <View style={styles.shadow}>
                        <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfimPassword} secureTextEntry={!visible} />
                        <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} />
                        <Icon2 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
                            onPress={() => setVisible(!visible)} />
                    </View>
                </View>
                <TouchableOpacity onPress={handleChange}
                    style={styles.button} >
                    {loading ? (
                        <ActivityIndicator size={18} color="white" />
                    ) : (
                        <Text style={styles.buttonText}>CONFIRM</Text>)
                    }
                </TouchableOpacity>
                <View
                    style={[styles.link, { marginTop: 15 }]}
                >
                    <Text style={styles.linkText}>
                        Back to
                    </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={[styles.linkText, { color: '#50C878', fontWeight: 'bold', marginLeft: 5 }]}>
                            Sign In.
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>)
}

export default ResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        borderTopEndRadius: 120,
        backgroundColor: 'white',
    },
    body: {
        paddingHorizontal: 25,
        paddingVertical: 20
    },
    inputLabel: {
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        backgroundColor: 'transparent',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingLeft: 40,
        paddingVertical: 15,
        color: 'black',
    },
    link: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 30,
    },
    linkText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#a6a6a6'
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
    logo: {
        height: 100,
        width: "100%",
        resizeMode: 'cover'
    },
    button: {
        backgroundColor: '#50C878',
        borderRadius: 25,
        alignSelf: 'center',
        paddingHorizontal: 60,
        paddingVertical: 15,
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});