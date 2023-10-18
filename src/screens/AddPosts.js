import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';

const AddPosts = ({ route, navigation }) => {

  const [image, setImage] = useState({})
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [influencer, setInfluencer] = useState()
  const [loading, setLoading] = useState(false)
  const { user } = useSelector(state => state.user)
  const handlePhoto = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    const assets = result.assets
    const file = {
      type: assets[0].type,
      name: assets[0].fileName,
      uri: assets[0].uri
    }
    setImage(file)
  }

  const getInfluencers = () => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records?page=1&perPage=50&filter=(isSeller~True)&sort=@random`, {
      method: "GET",
    }).then(res => res.json())
      .then(res => {
        console.log(res.items[0], 'ress')
        setInfluencer(res.items[0])
      }).catch(err => { console.log("Fetch Error: ", err); })

  }

  useEffect(() => {
    getInfluencers()
  }, [])

  const updateUser = (id, user) => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        tasks: [...user.tasks, id]
      })
    }).then(res => res.json())
      .then(res => {
        console.log("User Updated")
      }).catch(err => console.log("Fetch Error: ", err))
  }

  const handlePost = () => {
    if (text.length < 3 || !image.uri) {
      alert('Post image and description required!')
      return
    }
    if (url.length < 5) {
      alert('Valid website required!')
      return
    }
    setLoading(true)
    const form = new FormData()
    form.append('post_text', text)
    form.append('post_image', image)
    form.append('status', 'Pending')
    form.append('post_url', url)
    form.append('subscriber', user.id)
    form.append('influencer', influencer.id)
    form.append('amount', influencer.base)
    form.append('post_hit', 0)
    fetch("http://146.190.205.245/api/collections/tasks_opinion/records", {
      method: "POST",
      headers: {
        "Content-Type": 'multipart/form-data'
      },
      body: form
    }).then(res => res.json())
      .then(async (res) => {
        if (res.created) {
          await updateUser(res.id, user)
          await updateUser(res.id, influencer)
          Alert.alert("", "Task Added Successfully", [{
            text: 'Ok',
            onPress: () => navigation.goBack(),
          }])
        } else {
          const keys = Object.keys(res.data)
          console.log(res.data)
          const err = res.data[keys[0]].message
          Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
        }
        setLoading(false);
      }).catch(err => { console.log("Fetch Error: ", err); setLoading(false) })
  }

  return (
    <View style={{ backgroundColor: '#50C878', flex: 1, paddingTop: 10 }}>
      <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1 }}>
        <ScrollView style={{ backgroundColor: 'white', flex: 1, paddingTop: 20 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{
            padding: 15, backgroundColor: '#50C878', alignItems: 'center', alignSelf: 'center', borderRadius: 4
            , marginBottom: 20, borderRadius: 25,
            alignSelf: 'center',
            paddingHorizontal: 50,
            paddingVertical: 15,
          }}
            onPress={() => handlePhoto()}>
            <Text style={{ color: 'white' }}>Add Photo</Text>
          </TouchableOpacity>
          <View style={{ backgroundColor: 'white', borderRadius: 4 }}>
            <Image source={{ uri: image.uri ? image.uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxaU9SIVC1AZUv0jJW0WtEs0IgZlw0iiFs-w&usqp=CAU' }}
              style={{ width: '100%', height: 300, resizeMode: 'contain' }} />
            <View style={{ padding: 20 }}>
              <View style={styles.shadow}>
                <TextInput style={styles.input} value={text} onChangeText={setText} placeholder='Post Description' placeholderTextColor={'black'} />
                <Icon name='post-add' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
              </View>
              <View style={styles.shadow}>
                <TextInput style={styles.input} value={url} onChangeText={setUrl} placeholder='Website URL' placeholderTextColor={'black'} />
                <Icon2 name='web' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
              </View>
              <TouchableOpacity style={{
                padding: 15, backgroundColor: '#50C878', alignItems: 'center', alignSelf: 'center',
                borderRadius: 25,
                alignSelf: 'center',
                paddingHorizontal: 50,
                paddingVertical: 15,
              }}
                onPress={() => handlePost()}
                disabled={loading}>
                {loading ? <ActivityIndicator size={18} color="white" /> :
                  <Text style={{ color: 'white' }}>ADD</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

export default AddPosts;

const styles = StyleSheet.create({
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
});
