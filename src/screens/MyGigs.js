import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import { setUserInfo } from '../state/actions/userActions';

const GigCard = ({ id, navigation }) => {

  const [gig, setGig] = useState({})

  const getGigDetail = async () => {
    //setLoading(true);
    fetch(`http://146.190.205.245/api/collections/gigs/records/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": 'application/json'
      }
    }).then(res => res.json())
      .then(res => {
        setGig(res)
      }).catch(err => console.log("Fetch Error: ", err))
  }

  useEffect(() => {
    getGigDetail()
  }, [])

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detail', { gig: gig })}>
      {gig.images && <Image source={{ uri: `http://146.190.205.245/api/files/${gig?.collectionId}/${id}/` + gig?.images[0] }} style={styles.image} />}
      <View style={styles.details}>
        <Text style={styles.name}>{gig.name}</Text>
        <Text style={styles.description}>{gig.description}</Text>
        <View style={styles.social}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{
                uri: 'https://www.facebook.com/images/fb_icon_325x325.png',
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>{gig.facebook}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{
                uri: 'https://static.xx.fbcdn.net/assets/?revision=1329671031208790&name=desktop-instagram-gradient-logo&density=1',
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>{gig.instagram}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              resizeMode="contain"
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2KxlMK7ZjMnKydbAbX9Tk2JHIESpR-Rx_4g&usqp=CAU',
              }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialText}>{gig.twitter}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MyGigs = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const updateUser = () => {
    fetch(`http://146.190.205.245/api/collections/users/records/${user.id}`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        setIsRefreshing(false)
        dispatch(setUserInfo({ token: user.token, ...res }))
      }).catch((err) => {
        setIsRefreshing(false)
        console.log(err)
      })
  }


  const handleRefresh = () => {
    updateUser()
  }


  return (
    <View style={styles.container}>
      <View style={{
        borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1, backgroundColor: '#F5F5F4', paddingHorizontal: 10,
        paddingVertical: 20,
      }}>
        <FlatList
          ListEmptyComponent={
            <View style={{
              flex: 1, justifyContent: 'center'
            }}>
              <AnimatedLottieView
                style={{
                  alignSelf: 'center',
                  height: 250, width: 250
                }}
                source={require('../assets/empty.json')}
                autoPlay
                loop
              />
              <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold' }}>No Ad Packages Available</Text>
            </View>
          }
          contentContainerStyle={{ flex: 1, borderTopStartRadius: 10 }}
          ListHeaderComponent={() => (
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('New Gig')}>
              <Text style={styles.buttonText}>Add Package</Text>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["green"]} // for android
              tintColor={"green"} // for ios
            />
          }
          data={user.gigs}
          renderItem={({ item }) => <GigCard id={item} key={item.id} navigation={navigation} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#50C878',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  social: {
    flexDirection: 'row',
    marginTop: 10,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  socialIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  socialText: {
    fontSize: 14,
    color: 'black',
  },
  button: {
    backgroundColor: '#50C878',
    borderRadius: 10,
    borderRadius: 25,
    alignSelf: 'center',
    paddingHorizontal: 60,
    paddingVertical: 15,
    marginHorizontal: 30,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MyGigs;