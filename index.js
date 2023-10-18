/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging'

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // Update a users messages list using AsyncStorage
    console.log(remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
