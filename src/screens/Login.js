import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  KeyboardAvoidingView,
  ScrollView
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { setUserInfo } from '../state/actions/userActions';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'

const Login = ({ navigation }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      alert('Enter a valid email');
      return
    }
    setLoading(true);
    await fetch("http://146.190.205.245/api/collections/users_opinion/request-password-reset", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "email": email
      })
    }).then(res => res.text())
      .then(res => {
        navigation.navigate('Reset Password')
        setLoading(false);
        setEmail('')
        setIsForgotPassword(false)
      }).catch(err => { console.log("Fetch Error: ", err); setLoading(false) })
  }

  const handleLogin = () => {
    setLoading(true);
    fetch("http://146.190.205.245/api/collections/users_opinion/auth-with-password", {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "identity": email,
        "password": password,
      })
    }).then(res => res.json())
      .then(res => {
        if (res.token) {
          dispatch(setUserInfo({ ...res.record, token: res.token }))
          navigation.replace('Home');
        } else {
          setError("Invalid Email or Password")
        }
        setLoading(false);
      }).catch(err => console.log("Fetch Error: ", err))
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, [navigation]);

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ height: 100 }}>
        {/* <Text style={{
          color: 'white', fontSize: 30,
          width: "100%",
          textAlign: 'center'
        }}>Opinion Tracker</Text> */}
        <Image source={require('../assets/logo.jpeg')}
          style={{ width: '100%', height: 100, paddingVertical: 10, resizeMode: 'contain' }} />
      </View>
      <View style={{ flex: 1, borderTopColor: '#50C878', borderTopWidth: 8 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, backgroundColor: 'white' }}
          showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView style={styles.container}>
            {isForgotPassword ? (
              <View>
                <Text style={[styles.title, { marginBottom: 20 }]}>FORGOT PASSWORD</Text>
                <View style={styles.shadow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    placeholderTextColor={"black"}
                    autoCapitalize="none"
                    onChangeText={setEmail}
                    value={email}
                  />
                  <Icon name='email' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
                </View>
                <TouchableOpacity
                  disabled={loading}
                  style={[styles.button, { marginTop: 0, alignSelf: 'stretch' }]}
                  onPress={handleForgotPassword}>
                  {loading ? (
                    <ActivityIndicator size={18} color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Submit</Text>)}
                </TouchableOpacity>
                <View
                  style={[styles.link, { marginTop: 15 }]}
                >
                  <Text style={styles.linkText}>
                    Back to
                  </Text>
                  <TouchableOpacity onPress={() => setIsForgotPassword(false)}>
                    <Text style={[styles.linkText, { color: '#50C878', fontWeight: 'bold', marginLeft: 5 }]}>
                      Sign In.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <Text style={styles.title}>SIGN IN</Text>
                <Text style={styles.error}>{error}</Text>
                <View style={styles.shadow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={"black"}
                    onChangeText={setEmail}
                    value={email}
                  />
                  <Icon name='email' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
                </View>
                <View style={[styles.shadow, { marginBottom: 15 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry={!visible}
                    placeholderTextColor={"black"}
                    onChangeText={setPassword}
                    value={password}
                  />
                  <Icon name='vpn-key' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
                  <Icon3 name={visible ? 'eye-off' : 'eye'} size={22} style={{ position: 'absolute', right: 10 }}
                    color={'black'}
                    onPress={() => setVisible(!visible)} />
                </View>
                <TouchableOpacity onPress={() => setIsForgotPassword(true)} style={{ alignSelf: 'flex-end' }}>
                  <Text style={[styles.linkText, { color: '#50C878', fontWeight: 'bold', marginLeft: 5 }]}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                  {loading ? (
                    <ActivityIndicator size={18} color="white" />
                  ) : (
                    <Text style={styles.buttonText}>LOGIN</Text>
                  )}
                </TouchableOpacity>
                {/* <View style={styles.orContainer}>
                  <View style={styles.line} />
                  <Text style={styles.orText}>OR</Text>
                  <View style={styles.line} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity style={styles.socialButton}>
                    <Icon2 name="twitter" size={26} color="#00ACEE" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}>
                    <Icon2 name="facebook" size={32} color="#3B5998" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}
                    onPress={() => signInWithGoogle()}>
                    <Icon2 name="google" size={26} color="#F7B529" />
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={{ marginBottom: 10 }}>
                    <GoogleSigninButton
                      size={GoogleSigninButton.Size.Icon}
                      style={styles.socialButton}
                      color={'rgb(59,89,152)'}
                    />
                  </TouchableOpacity> */}
                {/* </View> */}
                <View
                  style={[styles.link]}
                >
                  <Text style={styles.linkText}>
                    Don't have an account?
                  </Text>
                  <TouchableOpacity onPress={() => navigation.replace('UserType')}>
                    <Text style={[styles.linkText, { color: '#50C878', fontWeight: 'bold', marginLeft: 5 }]}>
                      Register here.
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 50
  },
  logoContainer: {
    width: '100%',
    margin: 0
  },
  logo: {
    height: 100,
    width: "100%",
    resizeMode: 'cover'
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialButton: {
    backgroundColor: '#ECEBE9',
    borderRadius: 7,
    paddingHorizontal: 15,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: 'black',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
    marginBottom: 10,
  },
  socialIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#000',
    //fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
    marginHorizontal: 5,
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
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  }
});

export default Login;
