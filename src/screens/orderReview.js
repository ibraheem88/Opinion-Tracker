import React, { useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';

const OrderReview = ({ route, navigation }) => {
  const { user } = useSelector(state => state.user)
  console.log({ user })
  const [loading, setLoading] = useState(false)
  const { gig, rate, duration, seller } = route.params
  const total = rate + rate * 0.05
  const deadline = moment().add({ days: duration === 0 ? 14 : duration === 1 ? 30 : 90 })

  const updateUser = (user, id, updateCoins) => {
    let newcoins = 0
    if (updateCoins) {
      newcoins = parseInt(total)
    }
    const newOrders = [...user.orders, id]
    fetch(`http://146.190.205.245/api/collections/users/records/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        orders: newOrders,
        points: user.points - newcoins
      })
    }).then(res => res.json())
      .then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
  }


  const handleConfirmation = () => {
    if (user.points < parseInt(total)) {
      Alert.alert("", `Not Enough Coins! Buy Some`, [{
        text: 'Ok',
        onPress: () => navigation.navigate('Buy Coins'),
      }])
      return
    }
    const form = new FormData()
    form.append('name', gig.name)
    form.append("gig_id", gig.id)
    form.append("seller", gig.seller_id)
    form.append("buyer", user.id)
    form.append("status", 'Pending')
    form.append("deadline", moment(deadline).toISOString())
    form.append("amount", parseInt(total))
    form.append("posts", [])
    setLoading(true);
    fetch("http://146.190.205.245/api/collections/orders/records", {
      method: "POST",
      headers: {
        "Content-Type": 'multipart/form-data'
      },
      body: form
    }).then(res => res.json())
      .then((res) => {
        if (res.created) {
          updateUser(user, res.id, 'updateCoins')
          updateUser(seller, res.id)
          Alert.alert("", "Order Confirmed", [{
            text: 'Ok',
            onPress: () => navigation.goBack(),
          }])
        } else {
          console.log(res)
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
      <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1, backgroundColor: '#ECECEC' }}>
        <View style={{ padding: 15, flexDirection: 'row', borderBottomColor: 'lightgrey', borderBottomWidth: 1 }}>
          <Image style={styles.image} source={{ uri: `http://146.190.205.245/api/files/${gig?.collectionId}/${gig.id}/` + gig.images[0] }} />
          <Text style={{ marginLeft: 10, color: 'black' }}>{gig.name}</Text>
        </View>
        <View style={{ padding: 15, borderBottomColor: 'lightgrey', borderBottomWidth: 1 }}>
          <Text style={{ color: 'black', fontWeight: '600', fontSize: 15 }}>Order Details</Text>
          <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>{gig.description}</Text>
        </View>
        <View style={{ padding: 15, borderBottomColor: 'lightgrey', borderBottomWidth: 1 }}>
          <Text style={{ color: 'black', fontWeight: '600', fontSize: 15 }}>Order Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>Subtotal</Text>
            <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>{rate}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>Service Fee</Text>
            <Text style={{ color: 'black', fontSize: 15, marginTop: 10 }}>{rate * 0.05}</Text>
          </View>
        </View>
        <View style={{ padding: 15, borderBottomColor: 'lightgrey', borderBottomWidth: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Total</Text>
            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>{total}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>Completion Date</Text>
            <Text style={{ color: 'black', fontSize: 15, fontWeight: 'bold' }}>{moment(deadline).format('dddd DD,MMMM YYYY')}</Text>
          </View>
        </View>
        <TouchableOpacity
          //disabled={loading}
          onPress={() => { handleConfirmation() }}
          style={styles.button} >
          {loading ? (
            <ActivityIndicator size={18} color="white" />
          ) : (
            <Text style={styles.buttonText}>Confirm Order</Text>)}
        </TouchableOpacity>
      </View>
    </View>
  )
};

export default OrderReview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#50C878', flex: 1, paddingTop: 10
  },
  button: {
    backgroundColor: '#50C878',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 15,
    left: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  image: {
    width: 70,
    height: 50,
    borderRadius: 8
  },
});
