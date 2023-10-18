import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign'
import { launchImageLibrary } from 'react-native-image-picker';
import { View, ActivityIndicator, TextInput, Button, StyleSheet, TouchableOpacity, Text, ScrollView, Image, Alert } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import SelectDropdown from 'react-native-select-dropdown';
import Icon4 from 'react-native-vector-icons/Ionicons'
import Icon5 from 'react-native-vector-icons/Foundation'
import { useSelector } from 'react-redux';

const categories = ['Food', 'Garments', 'Shoes', 'Tech', 'Sports', 'Real Estate', 'Appliances'];

const AddGig = ({ navigation }) => {
  const { user } = useSelector(state => state.user)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState({});
  const [rate, setRate] = useState(null);
  const [ratePerClick, setRatePerClick] = useState(false);
  const [social, setSocial] = useState(['', '']);
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const updateUser = (id) => {
    fetch(`http://146.190.205.245/api/collections/users/records/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        gigs: [...user.gigs, id]
      })
    }).then(res => res.json())
      .then(res => {
        console.log("User Updated")
      }).catch(err => console.log("Fetch Error: ", err))
  }

  const handleSave = () => {
    const form = new FormData()
    form.append('name', name)
    form.append("description", description)
    form.append("images", images)
    form.append("rate", parseInt(rate))
    form.append("rate_per_click", ratePerClick)
    form.append("seller_id", user.id)
    form.append("category", category)
    form.append('social', ['aqu0jas4ql2xngp'])
    setLoading(true);
    fetch("http://146.190.205.245/api/collections/gigs/records", {
      method: "POST",
      headers: {
        "Content-Type": 'multipart/form-data'
      },
      body: form
    }).then(res => res.json())
      .then((res) => {
        updateUser(res.id)
        if (res.created) {
          Alert.alert("", "Gig Published Successfully", [{
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
  };

  const deleteSocial = (index) => {
    const socialUpdated = social.slice(0, index).concat(social.slice(index + 1))
    setSocial(socialUpdated)
  }

  const handleSocial = (link, index) => {
    const socialUpdated = [...social]
    socialUpdated[index] = link
    setSocial(socialUpdated)
  }

  const handleImages = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    const assets = result.assets
    const file = {
      type: assets[0].type,
      name: assets[0].fileName,
      uri: assets[0].uri
    }
    setImages(file)

  }

  return (
    <View style={{ backgroundColor: '#50C878', flex: 1, paddingTop: 10 }}>
      <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1 }}>
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}>
          <View style={{ marginHorizontal: 10, marginTop: 10 }}>
            <View style={styles.shadow}>
              <TextInput
                placeholder="Name"
                placeholderTextColor={"black"}
                style={styles.input}
                value={name}
                onChangeText={setName}
              />
              <Icon4 name='pencil-sharp' size={22} style={{ position: 'absolute', left: 10 }} />
            </View>
            <View style={styles.shadow}>
              <TextInput
                placeholder="Description"
                placeholderTextColor={"black"}
                style={styles.input}
                value={description}
                onChangeText={setDescription}
              />
              <Icon2 name='description' size={22} style={{ position: 'absolute', left: 10 }} />
            </View>
            {/* Add appropriate component for handling file upload */}
            {/* For example, you can use react-native-image-picker library */}
            <View style={styles.shadow}>
              <TextInput
                placeholder="Base Rate  Rate/Two Weeks"
                placeholderTextColor={"black"}
                style={styles.input}
                value={rate}
                onChangeText={value => setRate(value)}
                keyboardType="numeric"
              />
              <Icon5 name='dollar-bill' size={22} style={{ position: 'absolute', left: 10 }} />
            </View>
            <View style={styles.shadow}>
              <SelectDropdown
                defaultButtonText={"Category"}
                showsVerticalScrollIndicator={false}
                dropdownStyle={{ backgroundColor: 'white', opacity: 0.9, borderRadius: 5 }}
                buttonStyle={[styles.input, { width: '100%' }]}
                buttonTextStyle={{ fontSize: 14, textAlign: 'left', paddingLeft: 15 }}
                data={categories}
                onSelect={(selectedItem, index) => {
                  setCategory(selectedItem)
                }}
              />
              <Icon2 name='category' size={22} style={{ position: 'absolute', left: 10 }} />
            </View>
            <View>
              {/* <TouchableOpacity
                style={[styles.button, { marginBottom: 30, marginVertical: 0 }]}
                onPress={() => setRatePerClick(!ratePerClick)}
              >
                <Text style={styles.buttonText}>{ratePerClick ? 'Rate Per Click: ON' : 'Rate Per Click: OFF'}</Text>
              </TouchableOpacity> */}
            </View>
            {social.map((item, index) =>
              <View style={{ flexDirection: 'row', alignItems: 'center' }} key={index}>
                <View style={[styles.shadow, { width: '83%', marginBottom: 15 }]}>
                  <TextInput
                    placeholder="Social Links"
                    value={social[index]}
                    //placeholderTextColor={"black"}
                    style={[styles.input,]}
                    onChangeText={(t) => handleSocial(t, index)}
                  />
                  <Icon4 name='people' size={22} style={{ position: 'absolute', left: 10 }} />
                </View>
                {index == 0 ? <TouchableOpacity style={styles.plus} onPress={() => setSocial([...social, ''])}>
                  <Icon name="plus" size={22} color={"white"} />
                </TouchableOpacity> : <TouchableOpacity style={styles.plus} onPress={() => deleteSocial(index)}>
                  <Icon name="minus" size={22} color={"white"} />
                </TouchableOpacity>}
              </View>)}
          </View>
          <TouchableOpacity onPress={handleImages}
            style={[styles.button, { alignSelf: 'flex-start', paddingHorizontal: 30 }]} >
            <Text style={styles.buttonText}>Add Images</Text>
          </TouchableOpacity>
          {images.uri && <Image source={{ uri: images?.uri }}
            style={{ width: 80, height: 80, borderRadius: 5, marginVertical: 10 }} />}
          <TouchableOpacity onPress={handleSave}
            style={styles.button} >
            {loading ? (
              <ActivityIndicator size={18} color="white" />
            ) : (
              <Text style={styles.buttonText}>Save</Text>)
            }
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};
export default AddGig;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    height: 50,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
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
  button: {
    backgroundColor: '#50C878',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 60,
    paddingVertical: 15,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  link: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: 'black'
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center'
  },
  plus: {
    backgroundColor: '#50C878',
    borderRadius: 11,
    width: 40, height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  }
});

