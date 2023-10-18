import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../state/actions/userActions';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon4 from 'react-native-vector-icons/MaterialCommunityIcons'
import AnimatedLottieView from 'lottie-react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const GigCard = ({ id, name, render, navigation }) => {

  const { user } = useSelector(state => state.user)
  const [seller, setSeller] = useState({})
  const [order, setOrder] = useState({})
  const [options, setOptions] = useState(false)

  const getOrderDetail = async () => {
    //setLoading(true);
    fetch(`http://146.190.205.245/api/collections/tasks_opinion/records/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": 'application/json'
      }
    }).then(res => res.json())
      .then(res => {
        console.log(res, 'res')
        setOrder(res)
        getSeller(res)
      }).catch(err => console.log("Fetch Error: ", err))
  }

  const getSeller = (order) => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.isSeller ? order.subscriber : order.influencer}`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        //console.log(res, 'seller')
        setSeller(res)
      }).catch((err) => {
        console.log(err)
      })
  }

  const handleOrder = (status) => {
    fetch(`http://146.190.205.245/api/collections/tasks_opinion/records/${order.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        status: status
      })
    }).then(res => res.json())
      .then(res => {
        //console.log(res)
        setOrder(res)
        Alert.alert('', `Task ${status}`)
      }).catch(err => console.log("Fetch Error: ", err))
  }

  useEffect(() => {
    getOrderDetail()
  }, [render])

  return (
    name === order.status && (<View style={styles.shadow}>
      <View style={{ backgroundColor: 'white', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#BEBEBE' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: seller.avatar?.length > 1 ? `http://146.190.205.245/api/files/${seller.collectionId}/${seller.id}/${seller.avatar}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png" }}
            style={{ height: 50, width: 50, borderRadius: 25 }} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 16, color: 'black', marginLeft: 10, fontWeight: 'bold' }}>{seller.name}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Icon name="chat" size={28} color={"#50C878"} style={{ marginRight: 20 }} onPress={() => navigation.navigate('Chat Room', { seller })} />
          {!user.isSeller && order.status === 'Active' && <Icon3 name="ellipsis-vertical" size={28} color={"#50C878"} onPress={() => setOptions(true)} />}
        </View>
      </View>
      <TouchableOpacity style={styles.card} onPress={() => (order.status === 'Active' || order.status === 'Completed') && navigation.navigate('Order Detail', { task: order })}>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={1}>{order.post_text}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ padding: 10, backgroundColor: (order.status === 'Pending' && moment(new Date()).diff(moment(order.created), 'days' > 1)) || order.status === 'Disputed' ? '#B41F25' : order.status === 'Pending' ? 'orange' : order.status === 'Active' ? '#07d6db' : '#049b4b', borderRadius: 10 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 14, color: 'white' }}>{order.status == 'Pending' && moment(new Date()).diff(moment(order.created), 'days') > 1 ? "Cancelled" : order.status}</Text>
            </View>
            <View style={{ marginTop: 10, alignSelf: 'flex-end', marginRight: 10, flexDirection: 'row', alignItems: 'center' }}>
              <Icon4 name='currency-ngn' size={22} color={"#FFA500"} />
              <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold', marginLeft: 5 }}>{order.amount}</Text>
            </View>
          </View>
          {user.isSeller && order.status === 'Pending' && moment(new Date()).diff(moment(order.created), 'days') < 1 && <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <TouchableOpacity style={{ padding: 10, backgroundColor: '#66cc00', borderRadius: 10, width: '45%', alignItems: 'center' }}
              onPress={() => handleOrder('Active')}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ padding: 10, backgroundColor: '#e03e1e', borderRadius: 10, width: '45%', alignItems: 'center' }}
              onPress={() => handleOrder('Cancelled')}>
              <Text style={{ fontWeight: 'bold', color: 'white' }}>Cancel</Text>
            </TouchableOpacity>
          </View>}
          <Text>{moment(order.created).fromNow()}</Text>
        </View>
      </TouchableOpacity>
      {options && <View style={{
        backgroundColor: '#50C878', position: 'absolute', right: 10, top: 60, borderRadius: 8,
        borderWidth: 2, borderColor: 'black'
      }}>
        <Icon name="cancel" size={28} color={"white"} style={{ alignSelf: 'flex-end', marginRight: 10, marginVertical: 5 }} onPress={() => { setOptions(false) }} />
        <TouchableOpacity onPress={() => { setOptions(false); handleOrder('Disputed') }} style={{
          paddingVertical: 25, paddingHorizontal: 40, borderTopWidth: 1, borderTopColor: 'white', backgroundColor: '#50C878'
        }}>
          < Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Mark Dispute</Text>
        </TouchableOpacity >
      </View >}
    </View>)
  );
};

function MyTabs() {
  return (
    <View style={styles.container}>
      <View style={{ borderTopEndRadius: 40, backgroundColor: 'white', borderTopStartRadius: 40, overflow: 'hidden', flex: 1, paddingHorizontal: 10 }}>
        <Tab.Navigator>
          <Tab.Screen name="Active" component={Orders} />
          <Tab.Screen name="Pending" component={Orders} />
          <Tab.Screen name="Completed" component={Orders} />
          <Tab.Screen name="Disputed" component={Orders} />
        </Tab.Navigator>
      </View>
    </View>
  );
}

const Orders = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const [render, setRender] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  //console.log(navigation.canGoBack)

  const updateUser = () => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.id}`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        setIsRefreshing(false)
        setRender(!render)
        dispatch(setUserInfo({ token: user.token, email: user.email, ...res }))
      }).catch((err) => {
        setIsRefreshing(false)
        console.log(err)
      })
  }

  const handleRefresh = () => {
    updateUser()
  }

  return (

    <FlatList
      contentContainerStyle={{ paddingVertical: 20, borderTopStartRadius: 10, flexGrow: 1, backgroundColor: 'white' }}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
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
          <Text style={{ textAlign: 'center', marginTop: 10, fontWeight: 'bold', color: 'black' }}>No Orders Available</Text>
        </View>
      }
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={["green"]} // for android
          tintColor={"green"} // for ios
        />
      }
      data={user?.tasks?.reverse()}
      renderItem={({ item }) => (
        <GigCard navigation={navigation} id={item} name={route.name} render={render} />
      )}
    />
  );

}

export default MyTabs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#50C878', flex: 1, paddingTop: 10
  },
  shadow: {
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    marginHorizontal: 8,
    marginBottom: 35,
    elevation: 12,
    shadowColor: 'black',
  },
  input: {
    borderRadius: 10
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
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
    marginHorizontal: 30,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
