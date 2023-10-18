import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, Linking } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector } from 'react-redux';

const PostDetail = ({ route, navigation }) => {

    const [task, setTask] = useState(route.params.task)
    const [text, setText] = useState(task.post_text)
    const [url, setUrl] = useState(task.post_url)

    return (
        <View style={{ backgroundColor: '#50C878', flex: 1, paddingTop: 10 }}>
            <View style={{ borderTopEndRadius: 20, borderTopStartRadius: 20, overflow: 'hidden', flex: 1 }}>
                <ScrollView style={{ backgroundColor: 'white', flex: 1, paddingTop: 20 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
                    showsVerticalScrollIndicator={false}>
                    {/* <TouchableOpacity style={{
                        padding: 15, backgroundColor: '#50C878', alignItems: 'center', alignSelf: 'center', borderRadius: 4
                        , marginBottom: 20, borderRadius: 25,
                        alignSelf: 'center',
                        paddingHorizontal: 50,
                        paddingVertical: 15,
                    }}
                        onPress={() => handlePhoto()}>
                        <Text style={{ color: 'white' }}>Add Photo</Text>
                    </TouchableOpacity> */}
                    <View style={{ backgroundColor: 'white', borderRadius: 4 }}>
                        <Image source={{ uri: `http://146.190.205.245/api/files/${task?.collectionId}/${task?.id}/` + task?.post_image }}
                            style={{ width: '100%', height: 300, resizeMode: 'contain' }} />
                        <View style={{ padding: 20 }}>
                            <View style={styles.shadow}>
                                <Text style={styles.input} >{text}</Text>
                                <Icon name='post-add' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
                            </View>
                            <TouchableOpacity style={styles.shadow} onPress={() => Linking.openURL(url)}>
                                <Text style={[styles.input, { color: 'blue', fontWeight: 'bold' }]} >{url}</Text>
                                <Icon2 name='web' size={22} style={{ position: 'absolute', left: 10 }} color={'black'} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={{
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
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default PostDetail;

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
        marginTop: 35,
        elevation: 12,
        shadowColor: 'black',
    },
});