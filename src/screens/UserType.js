import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

const UserType = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={{ height: 100, justifyContent: 'center' }}>
        <Image source={require('../assets/logo.jpeg')}
          style={{ width: '100%', height: 100, paddingVertical: 10, resizeMode: 'contain' }} />
      </View>
      <View style={{
        flex: 1, paddingTop: 40,
        borderTopColor: '#50C878', borderTopWidth: 8,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
      }}>
        <Text style={styles.title}>ARE YOU AN INFLUENCER OR AN ADVERTISER?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register', { type: 'Seller' })}
        >
          <Text style={styles.buttonText}>Register as an Influencer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Register', { type: 'Buyer' })}
        >
          <Text style={styles.buttonText}>Register as an Advertiser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white', flex: 1

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#50C878',
    marginBottom: 20,
  },
  logo: {
    height: 100,
    width: "100%",
    resizeMode: 'cover'
  },
  button: {
    backgroundColor: '#50C878',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserType;