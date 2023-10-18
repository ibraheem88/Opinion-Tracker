import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import Icon2 from 'react-native-vector-icons/Feather'
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'

const ProfileScreen = ({ navigation }) => {
  const { user } = useSelector(state => state.user)
  console.log(user)

  return (
    <View style={styles.container}>
      <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Image
              source={{
                uri: user.avatar?.length > 1 ? `http://146.190.205.245/api/files/${user.collectionId}/${user.id}/${user.avatar}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
              }}
              style={styles.profileImage}
            />
            {user.verified && <Icon3 name='verified' size={24} color='green' style={{ position: 'absolute', right: -5, bottom: 15 }} />}
          </View>
          <Text style={styles.username}>{user.name}</Text>
          <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
            <Icon4 name='currency-ngn' size={22} color={"#FFA500"} />
            <Text style={{ color: 'black', marginLeft: 10, fontSize: 16 }}>{user.points} NGN</Text>
            {!user.isSeller && <TouchableOpacity style={{ marginLeft: 20, backgroundColor: '#50C878', borderRadius: 15, padding: 3 }}
              onPress={() => navigation.navigate('Buy Coins')}>
              <Icon2 name="plus" size={22} color={"white"} />
            </TouchableOpacity>}
          </View>
        </View>
        <View style={styles.body}>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Edit Profile')}>
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Change Password')}>
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Terms')}>
            <Text style={styles.optionText}>Terms and Conditions</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Verify Account')}>
            <Text style={styles.optionText}>Verify Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#50C878', flex: 1, paddingTop: 10
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  body: {
    paddingVertical: 20,
    paddingHorizontal: 30,
    flex: 1,
    backgroundColor: '#F5F5F4'
  },
  option: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default ProfileScreen;
