import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

const GigDetail = ({ route, navigation }) => {
  const { user } = useSelector(state => state.user)
  const { gig } = route.params
  const [seller, setSeller] = useState({})
  const [duration, setDuration] = useState(0)

  const getSeller = () => {
    fetch(`http://146.190.205.245/api/collections/users/records/${gig.seller_id}`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        setSeller(res)
      }).catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    getSeller()
  }, [])

  return (
    <View style={{ backgroundColor: '#50C878', flex: 1, paddingTop: 10 }}>
      <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}>
          <Image style={styles.image} source={{ uri: `http://146.190.205.245/api/files/${gig?.collectionId}/${gig.id}/` + gig.images[0] }} />
          <View style={{ backgroundColor: '#ECECEC', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#BEBEBE' }}>
            <View style={{ flexDirection: 'row' }}>
              <Image source={{ uri: seller.avatar?.length > 1 ? `http://146.190.205.245/api/files/_pb_users_auth_/${seller.id}/${seller.avatar}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png" }}
                style={{ height: 50, width: 50, borderRadius: 25 }} />
              <View style={{ flexDirection: 'column' }}>
                <Text style={{ fontSize: 16, color: 'black', marginLeft: 10, fontWeight: 'bold' }}>{seller.name}</Text>
                <Text style={{ fontSize: 16, color: 'black', marginLeft: 10 }}>4K Reach</Text>
              </View>
            </View>
            <Icon3 name="chat" size={28} color={"#50C878"} style={{ marginRight: 10 }} onPress={() => navigation.navigate('Chat Room', { seller })} />
          </View>
          <View style={styles.container}>
            <Text style={styles.name}>{gig.name}</Text>
            <Text style={styles.description}>{gig.description}</Text>
            <View style={styles.statsContainer}>
              <Text style={{ color: 'black', fontWeight: '600', fontSize: 16, marginBottom: 20 }}>Social Reach</Text>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Image
                  source={{
                    uri: 'https://www.facebook.com/images/fb_icon_325x325.png',
                  }}
                  style={styles.socialIcon}
                />
                <Text style={styles.stat}>1K Facebook followers</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Image
                  source={{
                    uri: 'https://static.xx.fbcdn.net/assets/?revision=1329671031208790&name=desktop-instagram-gradient-logo&density=1',
                  }}
                  style={styles.socialIcon}
                />
                <Text style={styles.stat}>2K Instagram followers</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                <Image
                  resizeMode="contain"
                  source={{
                    uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Twitter-logo.svg/1245px-Twitter-logo.svg.png',
                  }}
                  style={styles.socialIcon}
                />
                <Text style={styles.stat}>4K Twitter followers</Text>
              </View>
            </View>
            {!user.isSeller && <View style={{ borderBottomColor: 'lightgrey', borderBottomWidth: 1 }}>
              <Text style={{ color: 'black', fontWeight: '600', fontSize: 16, marginVertical: 20 }}>Duration</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: '#000',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                  onPress={() => setDuration(0)}>{
                    duration == 0 ?
                      (<View style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: '#000',
                      }} />) : null
                  }</TouchableOpacity>
                <Text style={[styles.description, { marginLeft: 10 }]}>Two Weeks</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: '#000',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                  onPress={() => setDuration(1)}>{
                    duration == 1 ?
                      (<View style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: '#000',
                      }} />) : null
                  }</TouchableOpacity>
                <Text style={[styles.description, { marginLeft: 10 }]}>One Month</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: '#000',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                  onPress={() => setDuration(2)}>{
                    duration == 2 ?
                      (<View style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: '#000',
                      }} />) : null
                  }</TouchableOpacity>
                <Text style={[styles.description, { marginLeft: 10 }]}>Three Months</Text>
              </View>
            </View>}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
              <Text style={{ marginHorizontal: 10, color: 'black' }}>{gig.reviews.length} reviews</Text>
              <Icon name="star" size={16} color={"#FFA500"} />
              <Text style={{ marginHorizontal: 5, fontWeight: 'bold', color: '#FFA500' }}>{gig.rating.length > 1 ? gig.rating : "0.0"}</Text>
            </View>
            {!user.isSeller && <TouchableOpacity
              onPress={() => navigation.navigate('Order Review', { gig, rate: duration == 0 ? gig.rate : duration == 1 ? gig.rate * 2 : gig.rate * 6, duration, seller })}
              style={styles.button} >
              {/* {loading ? (
              <ActivityIndicator size={18} color="white" />
            ) : ( */}
              <Text style={styles.buttonText}>Continue</Text>
              <Icon2 name='coins' size={16} color={"#FFA500"} />
              <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold', marginLeft: 5 }}>{duration == 0 ? gig.rate : duration == 1 ? gig.rate * 2 : gig.rate * 6}</Text>
            </TouchableOpacity>}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 300
  },
  socialIcon: {
    width: 25,
    height: 25,
    marginRight: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#50C878',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: 'black',
  },
  statsContainer: {
    //marginHorizontal:10,
    borderBottomColor: 'lightgrey',
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  stat: {
    fontSize: 16,
    marginLeft: 10,
    color: 'black',
    fontWeight: '500',
  },
});

export default GigDetail;