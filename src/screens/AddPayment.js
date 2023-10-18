import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { CardField, useConfirmPayment } from '@stripe/stripe-react-native';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { setUserInfo } from '../state/actions/userActions';
import { useSelector, useDispatch } from 'react-redux';

const AddPayment = ({ navigation }) => {
  const { confirmPayment } = useConfirmPayment()
  const { user } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const [coins, setCoins] = useState(0)
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(false)
  const [validCard, setValidCard] = useState(false)
  const packages = [1000, 5000, 10000, 25000, 50000, 100000]

  const addCoins = () => {
    let newcoins = packages[selected] + user.points
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        points: newcoins
      })
    }).then(res => res.json())
      .then(res => {
        dispatch(setUserInfo({ ...user, points: newcoins }))
        Alert.alert("", `Coins Added to Wallet!`, [{
          text: 'Ok',
          onPress: () => navigation.goBack(),
        }])
      }).catch(err => console.log("Fetch Error: ", err))
  }

  const initiatePaymentIntent = () => {
    const billingDetails = {
      name: 'Mazrav Kelin',
      email: 'mazrav@gmail.com',
    };
    fetch('http://172.20.10.5:3000/create-payment-intent', {
      headers: {
        "content-type": 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(
        {
          amount: packages[selected]
        }
      )
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.clientSecret) {
          const { error } = await confirmPayment(res.clientSecret, {
            payment_method: "card",
            billingDetails: billingDetails,
          });
          console.log(error)
          if (!error) {
            Alert.alert("", `Coins Added to Wallet!`)
          } else {
            Alert.alert("", error)
          }
        }
      })
      .catch((err) => console.log(err))
  }

  const checkValid = (card) => {
    if (card.complete) {
      setValidCard(true)
    }
    else {
      setValidCard(false)
    }
  }



  return (
    <View style={{ padding: 10, justifyContent: 'center', flex: 1 }}>
      <FlatList
        data={packages}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={{
            flexDirection: 'row', marginRight: 10, alignItems: 'center', justifyContent: 'center',
            padding: 30, borderColor: selected === index ? '#50C878' : 'lightgrey', borderWidth: 1, borderRadius: 8, backgroundColor: 'white'
          }}
            onPress={() => setSelected(index)}>
            <Icon2 name='currency-ngn' size={22} color={"#FFA500"} />
            <Text style={{ color: 'black', marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <CardField
        postalCodeEnabled={false}
        onCardChange={(card) => checkValid(card)}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          placeholderColor: '#000000',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
      />
      <Pressable onPress={() => initiatePaymentIntent()}
        disabled={!validCard || loading}
        style={styles.button} >
        <Text style={styles.buttonText}>CONFIRM</Text>
      </Pressable>
    </View>)
}

export default AddPayment;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#50C878',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 15,
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});