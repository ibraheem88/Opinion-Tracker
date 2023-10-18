import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

const SettingsScreen = () => {
  // const {user}=useSelector(state=>state.user)
  // console.log(user)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const toggleNotifications = () =>
    setNotificationsEnabled(!notificationsEnabled);
  const toggleLocation = () => setLocationEnabled(!locationEnabled);
  const toggleDarkMode = () => setDarkModeEnabled(!darkModeEnabled);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Settings</Text> */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleNotifications}
          value={notificationsEnabled}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={locationEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleLocation}
          value={locationEnabled}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={toggleDarkMode}
          value={darkModeEnabled}
        />
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#50C878',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsScreen;
