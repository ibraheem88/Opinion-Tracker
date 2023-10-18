import React, { useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'

const ChangePassword = () => {

  const { user } = useSelector(state => state.user)
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [confirmPassword, setConfimPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = () => {
    if (!(newPassword.length >= 8 && confirmPassword.length >= 8)) {
      Alert.alert("", 'Password length must be 8 atleast')
      return
    }
    setLoading(true);
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "oldPassword": password,
        "password": newPassword,
        "passwordConfirm": confirmPassword
      })
    }).then(res => res.json())
      .then((res) => {
        console.log(res)
        if (res.created) {
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
    <View style={styles.container}>
      <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1, backgroundColor: 'white' }}>
        <View style={styles.body}>
          <Text style={styles.inputLabel}>OLD PASSWORD</Text>
          <View style={styles.shadow}>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={!visible} />
            <Icon3 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
              color={'black'}
              onPress={() => setVisible(!visible)} />
            <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
          </View>
          <Text style={styles.inputLabel}>NEW PASSWORD</Text>
          <View style={styles.shadow}>
            <TextInput style={styles.input} value={newPassword} onChangeText={setNewPassword} secureTextEntry={!visible} />
            <Icon3 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
              onPress={() => setVisible(!visible)} color={'black'} />
            <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
          </View>
          <Text style={styles.inputLabel}>CONFRIM PASSWORD</Text>
          <View style={styles.shadow}>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfimPassword} secureTextEntry={!visible} />
            <Icon3 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
              color={'black'}
              onPress={() => setVisible(!visible)} />
            <Icon name='vpn-key' size={22} color={'black'} style={{ position: 'absolute', left: 10 }} />
          </View>
        </View>
        <TouchableOpacity onPress={handleChange}
          style={styles.button} disabled={loading}>
          {loading ? (
            <ActivityIndicator size={18} color="white" />
          ) : (
            <Text style={styles.buttonText}>CONFIRM</Text>)
          }
        </TouchableOpacity>
      </View>
    </View>)
}

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#50C878', flex: 1, paddingTop: 10
  },
  body: {
    paddingHorizontal: 25,
    paddingVertical: 20
  },
  inputLabel: {
    fontWeight: 'bold',
    color: 'black',
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
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
