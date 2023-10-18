import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../state/actions/userActions';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign'
import Icon2 from 'react-native-vector-icons/Octicons'
import Icon3 from 'react-native-vector-icons/MaterialIcons'

const SocialLink = ({ index, social, handleSocial, deleteSocial, setSocial }) => {

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} key={index}>
      <View style={[styles.shadow, { width: '83%', marginBottom: 10 }]}>
        <TextInput
          //placeholder="Social"
          value={social[index]}
          placeholderTextColor={"black"}
          style={styles.input}
          onChangeText={(t) => handleSocial(t, index)}
        />
        <Icon3 name='person' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
      </View>
      {index == 0 ? <TouchableOpacity style={styles.plus} onPress={() => setSocial([...social, ''])}>
        <Icon name="plus" size={22} color={"white"} />
      </TouchableOpacity> : <TouchableOpacity style={styles.plus} onPress={() => deleteSocial(index)}>
        <Icon name="minus" size={22} color={"white"} />
      </TouchableOpacity>}
    </View>)
}

const EditProfile = ({ navigation }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.user)
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [image, setImage] = useState({})
  const [social, setSocial] = useState(user.social.length == 0 ? [''] : user.social);
  const [socialIds, setSocialIds] = useState(user.social.length == 0 ? [] : user.social);
  const [loading, setLoading] = useState(false);
  //console.log(social)

  const updateUser = () => {
    fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.id}`, {
      method: "GET"
    }).then(res => res.json())
      .then((res) => {
        console.log(res)
        dispatch(setUserInfo({ token: user.token, email: user.email, ...res }))
      }).catch((err) => {
        console.log(err)
      })
  }

  const isValidURL = (str) => {
    return (/^(http(s?):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g.test(str))
  }

  const updateLinks = (index, updatedLinks) => {
    if (socialIds[index]) {
      fetch(`http://146.190.205.245/api/collections/social_opinion/records/${socialIds[index]}`, {
        method: "GET"
      }).then(res => res.json())
        .then((res) => {
          console.log(res, 'rr', index)
          if (res.id) {
            updateLinks(index + 1, [...updatedLinks, res.social_uri])
          }
        }).catch((err) => {
          console.log(err)
        })
    } else {
      updatedLinks = updatedLinks?.length === 0 ? [''] : updatedLinks
      setSocial(updatedLinks)
    }
  }

  useEffect(() => {
    updateLinks(0, [])
  }, [])

  const createSocial = (index, socialIds) => {
    if (social[index]) {
      setLoading(true)
      const form = new FormData()
      form.append('social_uri', social[index])
      fetch(`http://146.190.205.245/api/collections/social_opinion/records`, {
        method: "POST",
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        body: form
      }).then(res => res.json())
        .then(res => {
          if (res.created) {
            createSocial(index + 1, [...socialIds, res.id])
          } else {
            const keys = Object.keys(res.data)
            console.log(res.data)
            const err = res.data[keys[0]].message
            Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
          }
        }).catch(err => { console.log("Fetch Error Link Create: ", err); })
    } else {
      patchUser(socialIds)
    }

  }

  const patchUser = (socialIds) => {
    console.log(socialIds, 'patch')
    setTimeout(() => {
      setLoading(true);
      const form = new FormData()
      form.append('name', name)
      if (socialIds.length > 0) {
        socialIds.forEach(item => {
          form.append(
            "social", item
          );
        })
      }
      form.append('username', username)
      //form.append('social', JSON.stringify(socialIds))
      if (image.uri) {
        form.append('avatar', image)
      }
      fetch(`http://146.190.205.245/api/collections/users_opinion/records/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": 'multipart/form-data'
        },
        body: form
      }).then(res => res.json())
        .then((res) => {
          if (res.created) {
            Alert.alert("", "Profile Updated Successfully", [{
              text: 'Ok',
              onPress: () => { updateUser(); navigation.goBack() },
            }])
          } else {
            const keys = Object.keys(res.data)
            console.log(res.data)
            const err = res.data[keys[0]].message
            Alert.alert("", keys[0].charAt(0).toUpperCase() + keys[0].slice(1) + ": " + err)
          }
          setLoading(false);
        }).catch(err => { console.log("Fetch Error: ", err); setLoading(false) })
    }, 2000)
  }

  const deleteLinks = (link) => {
    if (link) {
      fetch(`http://146.190.205.245/api/collections/social_opinion/records/${link}`, {
        method: "DELETE"
      }).then(res => res.text())
        .then((res) => {
          console.log("Link Deleted", res)
        }).catch((err) => {
          console.log(err)
        })
    }
  }

  handleSave = () => {
    console.log(social)
    if (user.isSeller) {
      const newSocial = [...social.filter(item => !isValidURL(item))]
      if (newSocial.length > 0) {
        Alert.alert('', 'All Social links must be a valid url!')
        return
      }
      socialIds.map(item => deleteLinks(item))
      createSocial(0, [])
    } else {
      patchUser([])
    }

  }

  const deleteSocial = (index) => {
    const socialUpdated = social.slice(0, index).concat(social.slice(index + 1))
    console.log(social, index)
    setSocial(socialUpdated)
  }

  const handleSocial = (link, index) => {
    const socialUpdated = [...social]
    socialUpdated[index] = link
    setSocial(socialUpdated)
  }

  const handleImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    const assets = result.assets
    const file = {
      type: assets[0].type,
      name: assets[0].fileName,
      uri: assets[0].uri
    }
    setImage(file)

  }

  return (
    <View style={{ backgroundColor: '#50C878', flex: 1, paddingTop: 10 }}>
      <View style={{ borderTopEndRadius: 30, borderTopStartRadius: 30, overflow: 'hidden', flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Image
                source={{
                  uri: image?.uri ? image.uri : user.avatar.length > 0 ? `http://146.190.205.245/api/files/${user.collectionId}/${user.id}/${user.avatar}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
                }}
                style={styles.profileImage}
              />
              <TouchableOpacity style={[styles.plus, { position: 'absolute', right: -20, bottom: 10 }]} onPress={() => handleImage()}>
                <Icon2 name="pencil" size={22} color={"white"} />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.username}>{user.name}</Text>
            </View>
          </View>
          <View style={styles.body}>
            <Text style={styles.inputLabel}>NAME</Text>
            <View style={styles.shadow}>
              <TextInput style={styles.input} value={name} onChangeText={setName} />
              <Icon3 name='person' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
            </View>
            <Text style={styles.inputLabel}>USERNAME</Text>
            <View style={styles.shadow}>
              <TextInput style={styles.input} value={username} onChangeText={setUsername} />
              <Icon3 name='person' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
            </View>
            {user.isSeller && <Text style={styles.inputLabel}>SOCIAL LINKS</Text>}
            {user.isSeller && social.map((item, index) => <SocialLink index={index} handleSocial={handleSocial} social={social} deleteSocial={deleteSocial} setSocial={setSocial} key={index} />)}
          </View>
          <TouchableOpacity onPress={handleSave}
            style={styles.button} disabled={loading}>
            {loading ? (
              <ActivityIndicator size={18} color="white" />
            ) : (
              <Text style={styles.buttonText}>Save Changes</Text>)
            }
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>)
}

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  body: {
    paddingHorizontal: 25,
    paddingVertical: 20
  },
  inputLabel: {
    fontWeight: 'bold',
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
    marginBottom: 35,
    elevation: 12,
    shadowColor: 'black',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    //backgroundColor: '#C7F6B6',
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
  plus: {
    backgroundColor: '#50C878',
    borderRadius: 11,
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#50C878',
    borderRadius: 25,
    paddingHorizontal: 60,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    right: 25,
    left: 25,
    bottom: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
