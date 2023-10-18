import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, ActivityIndicator,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/Ionicons'
import Icon3 from 'react-native-vector-icons/AntDesign'

const Register = ({ navigation, route }) => {
  const isSeller = route.params.type === "Seller"
  const [username, setUsername] = useState('');
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [social, setSocial] = useState(['']);
  const [socialIds, setSocialIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const deleteSocial = (index) => {
    const socialUpdated = social.slice(0, index).concat(social.slice(index + 1))
    setSocial(socialUpdated)
  }

  const handleSocial = (link, index) => {
    const socialUpdated = [...social]
    socialUpdated[index] = link
    setSocial(socialUpdated)
  }

  const isValidURL = (str) => {
    return (/^(http(s?):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str))
  }

  const createUser = (socialIds) => {
    console.log(socialIds)
    fetch("http://146.190.205.245/api/collections/users_opinion/records", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "username": username,
        "email": email,
        "password": password,
        "passwordConfirm": confirmPassword,
        "name": name,
        "amount": '100',
        "isSeller": isSeller,
        'social': socialIds
      })
    }).then(res => res.json())
      .then((res) => {
        console.log(res)
        if (res.created) {
          setError('')
          setEmail('');
          setName('');
          setPassword('');
          setConfirmPassword('')
          setUsername('')
          Alert.alert("Success", "Account Created Successfully", [{
            text: 'Ok',
            onPress: () => navigation.replace('Login'),
          }])
        } else {
          const keys = Object.keys(res.data)
          console.log(res.data)
          const err = res.data[keys[0]].message
          setError(keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
        }
        setLoading(false);
      }).catch(err => console.log("Fetch Error: ", err))
  }

  // useEffect(() => {
  //   console.log(socialIds, social)
  //   if (socialIds.length === social.length) {
  //     createUser()
  //   }
  // }, [socialIds])

  const createSocial = (index, socialIds) => {
    if (social[index]) {
      setLoading(true)
      const form = new FormData()
      form.append('social_uri', social[index])
      fetch(`http://146.190.205.245/api/collections/social_opinion/records`, {
        method: "POST",
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        body: form
      }).then(res => res.json())
        .then(res => {
          if (res.created) {
            createSocial(index + 1, [...socialIds, res.id])
          } else {
            const keys = Object.keys(res.data)
            console.log(res.data)
            const err = res.data[keys[0]].message
            Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
          }
        }).catch(err => { console.log("Fetch Error Link Create: ", err); })
    } else {
      createUser(socialIds)
    }

  }


  const handleRegister = () => {
    const newSocial = [...social.filter(item => !isValidURL(item))]
    if (newSocial.length > 0) {
      Alert.alert('', 'All Social links must be a valid url!')
      return
    }
    //setSocialIds([])
    createSocial(0, [])
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}><View style={styles.logoContainer}>
      {/* <Image
        style={styles.logo}
        source={require('../assets/logoHeader.jpg')}
      /> */}
      <Image source={require('../assets/logo.jpeg')}
        style={{ width: '100%', height: 100, resizeMode: 'contain' }} />
    </View>
      <View style={{ flex: 1, borderTopColor: '#50C878', borderTopWidth: 8 }}>
        <ScrollView contentContainerStyle={{
          flexGrow: 1, paddingBottom: 40, backgroundColor: 'white'
        }}
          showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView style={styles.container} >
            <Text style={styles.title}>SIGN UP</Text>
            <Text style={styles.error}>{error}</Text>
            <View style={styles.shadow}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={"black"}
                onChangeText={setUsername}
                value={username}
              />
              <Icon name='person' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
            </View>
            <View style={styles.shadow}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={"black"}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={setEmail}
                value={email}
              />
              <Icon name='email' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
            </View>
            <View style={styles.shadow}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor={"black"}
                onChangeText={setName}
                value={name}
              />
              <Icon name='person' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
            </View>
            <View style={styles.shadow}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={"black"}
                secureTextEntry={!visible}
                onChangeText={setPassword}
                value={password}
              />
              <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
              <Icon2 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
                color={'black'}
                onPress={() => setVisible(!visible)} />
            </View>
            <View style={styles.shadow}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={"black"}
                secureTextEntry={!visible}
                onChangeText={setConfirmPassword}
                value={confirmPassword}
              />
              <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
              <Icon2 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
                color={'black'}
                onPress={() => setVisible(!visible)} />
            </View>
            {isSeller && social.map((item, index) =>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} key={index}>
                <View style={[styles.shadow, { width: '83%', marginBottom: 10 }]}>
                  <TextInput
                    placeholder="Social Link"
                    value={social[index]}
                    placeholderTextColor={"black"}
                    style={styles.input}
                    onChangeText={(t) => handleSocial(t, index)}
                  />
                  <Icon name='person' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
                </View>
                {index == 0 ? <TouchableOpacity style={styles.plus} onPress={() => setSocial([...social, ''])}>
                  <Icon3 name="plus" size={22} color={"white"} />
                </TouchableOpacity> : <TouchableOpacity style={styles.plus} onPress={() => deleteSocial(index)}>
                  <Icon3 name="minus" size={22} color={"white"} />
                </TouchableOpacity>}
              </View>)}
            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator size={18} color="white" />
              ) : (
                <Text style={styles.buttonText}>Proceed</Text>
              )}
            </TouchableOpacity>
            <View
              style={styles.link}
            >
              <Text style={styles.linkText}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.replace('Login')}>
                <Text style={[styles.linkText, { color: '#50C878', fontWeight: 'bold', marginLeft: 5 }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: "white"
  },
  logo: {
    height: 100,
    width: "100%",
    resizeMode: 'cover'
  },
  title: {
    fontSize: 26,
    alignSelf: 'center',
    color: '#50C878',
  },
  plus: {
    backgroundColor: '#50C878',
    borderRadius: 11,
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  link: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#a6a6a6'
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  }
});
