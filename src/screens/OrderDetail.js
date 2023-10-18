import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, Image, RefreshControl, Linking, TextInput, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../state/actions/userActions';
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
const SocialCard = ({ id }) => {
  const [link, setLink] = useState({})

  const getSocialDetail = async () => {
    fetch(`http://146.190.205.245/api/collections/social_opinion/records/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": 'application/json'
      }
    }).then(res => res.json())
      .then(res => {
        //console.log(res)
        setLink(res)
      }).catch(err => console.log("Fetch Error: ", err))
  }

  useEffect(() => {
    getSocialDetail()
  }, [])

  return (
    <View style={[styles.shadow, { borderRadius: 16, marginBottom: 30 }]}>
      <TouchableOpacity onPress={() => Linking.openURL(link.social_uri)
      } style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 30, paddingRight: 10 }}>
        <Icon2 name='web' size={22} style={{ marginLeft: 10 }} color={'black'} />
        <Text style={{ color: 'blue', marginLeft: 10, fontWeight: 'bold', width: '85%' }} numberOfLines={1}>{link.social_uri}</Text>
      </TouchableOpacity>
    </View >
  )
}

const OrderDetail = ({ route, navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const [task, setTask] = useState(route.params.task)
  const [subscriber, setSubscriber] = useState()
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [social, setSocial] = useState('');


  const handleOrder = () => {
    fetch(`http://146.190.205.245/api/collections/tasks_opinion/records/${task.id}`, {
      method: "GET",
      headers: {
        "Content-Type": 'application/json'
      }
    }).then(res => res.json())
      .then(res => {
        //console.log(res, 'res')
        setTask(res)
        setIsRefreshing(false)
      }).catch(err => { console.log("Fetch Error: ", err); setIsRefreshing(false) })

  }

  const getInfluencer = () => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${task.influencer}`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        getServiceFee(res)
      }).catch((err) => {
        console.log(err)
      })
  }

  const getServiceFee = (influencer) => {
    fetch(`http://146.190.205.245/api/collections/admin_opinion/records/cemehgjzyc8r6zd`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        if (res.value) {
          updateInfluencer(influencer, res.value)
        }
      }).catch((err) => {
        console.log(err)
      })
  }

  const getSubscriber = () => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${task.subscriber}`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        //console.log("Sub")
        setSubscriber(res)
        //updateInfluencer()
      }).catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    handleOrder()
    getSubscriber()
  }, [])

  const updateInfluencer = (influencer, fee) => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${task.influencer}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        points: influencer.points + parseInt(task.amount) * ((100 - fee) / 100),
        earnings: influencer.earnings + parseInt(task.amount) * ((100 - fee) / 100),
        tasks_completed: influencer.tasks_completed + 1
      })
    }).then(res => res.json())
      .then((res) => {
        if (res.created) {

        } else {
          const keys = Object.keys(res.data)
          console.log(res.data)
          const err = res.data[keys[0]].message
          Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
        }
      }).catch((err) => {
        console.log(err, 'Error Update Influencer')
      })
  }

  const updateSubscriber = () => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${task.subscriber}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        points: user.points - parseInt(task.amount),
        tasks_completed: user.tasks_completed + 1
      })
    }).then(res => res.json())
      .then((res) => {
        if (res.created) {
          dispatch(setUserInfo({ token: user.token, email: user.email, ...res }))
        } else {
          const keys = Object.keys(res.data)
          console.log(res.data)
          const err = res.data[keys[0]].message
          Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
        }
      }).catch((err) => {
        console.log(err, 'Error Update Influencer')
      })
  }

  const handleConfirm = () => {
    if (user.points >= parseInt(task.amount)) {
      setLoading2(true)
      fetch(`http://146.190.205.245/api/collections/tasks_opinion/records/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          status: "Completed"
        })
      }).then(res => res.json())
        .then((res) => {
          if (res.created) {
            Alert.alert("", "Task Completed", [{
              text: 'Ok',
              onPress: () => { handleOrder(); getInfluencer(); updateSubscriber() },
            }])
          } else {
            const keys = Object.keys(res.data)
            console.log(res.data)
            const err = res.data[keys[0]].message
            Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
          }
          setLoading2(false);
        }).catch((err) => {
          console.log(err, 'Error Update Task')
        })
    } else {
      Alert.alert("", `Not Enough Coins! Buy Some`, [{
        text: 'Ok',
        onPress: () => navigation.navigate('Buy Coins'),
      }])
      return
    }
  }

  const sendPushNotification = (url) => {
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: "POST",
      headers: {
        "Content-Type": 'application/json',
        'Authorization': 'key=AAAAwwGobks:APA91bHnW1DVmzraVT5qTPnm48qJJVuEfKhCSlnQxVNx--iACsm3QDY2QVqY_pw6M9UbUzvzOHwNXDFcnxcSUTWzTfrWlpB3eQFXKM0g5DykQJS1oTyUUzKHADq8Fs5C5zs4ikdcO2uo',
      },
      body: JSON.stringify({
        "to": subscriber.fcmToken,
        "notification": {
          "title": `${user.name} is talking about ${task.post_text}`,
          "body": "Click here to see more!",
          "mutable_content": true,
          "sound": "Tri-tone"
        },

        "data": {
          "type": url,
        }
      })
    }).then(res => res.json()).then((res) => {
      if (res.success === 1) {
        console.log('Notification Sent')
      }
    }).catch(err => console.log("notification error", err))
  }

  const updateTask = (id, url) => {
    fetch(`http://146.190.205.245/api/collections/tasks_opinion/records/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        social: [...task.social, id]
      })
    }).then(res => res.json())
      .then((res) => {
        if (res.created) {
          Alert.alert("", "Social Link Added", [{
            text: 'Ok',
            onPress: () => { handleOrder(); sendPushNotification(url) },
          }])
        } else {
          const keys = Object.keys(res.data)
          console.log(res.data)
          const err = res.data[keys[0]].message
          Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
        }
        setLoading(false);
      }).catch((err) => {
        console.log(err, 'Error Update Task')
      })
  }

  const isValidURL = (str) => {
    return (/^(http(s?):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str))
  }

  const handleSocial = () => {
    if (!isValidURL(social)) {
      Alert.alert("", 'Social Link Must Be a Valid Url.')
      return
    }
    setLoading(true)
    const form = new FormData()
    form.append('task_id', task.id)
    form.append('social_uri', social)
    fetch(`http://146.190.205.245/api/collections/social_opinion/records`, {
      method: "POST",
      headers: {
        "Content-Type": 'multipart/form-data'
      },
      body: form
    }).then(res => res.json())
      .then(res => {
        setSocial('')
        if (res.created) {
          updateTask(res.id, social)
        } else {
          const keys = Object.keys(res.data)
          console.log(res.data)
          const err = res.data[keys[0]].message
          Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
        }
      }).catch(err => { console.log("Fetch Error Link Create: ", err); setIsRefreshing(false) })

  }


  const handleRefresh = () => {
    setIsRefreshing(true)
    handleOrder()
  }


  return (
    <View style={styles.container}>
      <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1, paddingTop: 20, backgroundColor: 'white' }}>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 25, paddingTop: 5 }}
          ListHeaderComponent={
            <>
              <TouchableOpacity style={{
                padding: 15, backgroundColor: '#50C878', alignItems: 'center', alignSelf: 'center', borderRadius: 4
                , marginBottom: 20, borderRadius: 25,
                alignSelf: 'center',
                paddingHorizontal: 50,
                paddingVertical: 15,
              }}
                onPress={() => { navigation.navigate('Post Detail', { task: task }) }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Show Post Detail</Text>
              </TouchableOpacity>
              <Text style={[styles.inputLabel, !user.isSeller && { marginBottom: 20 }]}>SOCIAL LINKS</Text>
              {user.isSeller && <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 30 }}>
                <View style={[styles.shadow, { width: '80%' }]}>
                  <TextInput
                    //placeholder="Social"
                    value={social}
                    placeholderTextColor={"black"}
                    style={styles.input}
                    onChangeText={(t) => setSocial(t)}
                  />
                  <Icon3 name='person' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
                </View>
                <TouchableOpacity style={styles.plus} onPress={() => handleSocial()} disabled={loading}>{loading ? (
                  <ActivityIndicator size={18} color="white" />
                ) : (
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>)}
                </TouchableOpacity>
              </View>}
            </>
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={{ color: 'black', alignSelf: 'center' }}>No Social Links Added Yet</Text>}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["green"]} // for android
              tintColor={"green"} // for ios
            />
          }
          data={task.social}
          renderItem={({ item }) => (
            <SocialCard id={item} />
          )}
        //ListFooterComponent={<View style={{ height: 40 }} />}
        />
        {!user.isSeller && task.status === 'Active' && <TouchableOpacity onPress={handleConfirm}
          style={styles.button} disabled={loading2}>
          {loading2 ? (
            <ActivityIndicator size={18} color="white" />
          ) : (
            <Text style={styles.buttonText}>Confirm Task Completion</Text>)
          }
        </TouchableOpacity>}
      </View>

    </View>
  );
}

export default OrderDetail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#50C878', flex: 1, paddingTop: 10
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
    //marginBottom: 35,
    elevation: 12,
    shadowColor: 'black',
  },
  plus: {
    backgroundColor: '#50C878',
    borderRadius: 11,
    width: 50,
    paddingVertical: 18,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#50C878',
    borderRadius: 25,
    marginHorizontal: 25,
    paddingVertical: 20,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
