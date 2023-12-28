import firestore from '@react-native-firebase/firestore';

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';

import {setLogin} from '../features/productReducer';
// import {setLogin} from '../features/productReducer';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  // const login = useSelector(state => state.barcod.isLogin);

  const handeClick = async () => {
    let array = [];

    await firestore()
      .collection('admins')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(item => {
          // console.log('ADMIN ID: ', item.id, item.data());
          array.push(item.data());
        });
      });

    setData(array);
  };

  const updateLogin = async id => {};

  useEffect(() => {
    let id;
    if (data && data.length > 0) {
      let isValid = false;
      data.forEach(item => {
        if (item.username === username && item.password === password) {
          isValid = true;
          id = item.id;
        }
      });
      if (isValid) {
        // updateLogin(id);
        dispatch(setLogin(true));
      } else {
        Alert.alert(
          'Doğrulama başarısız! Kullanıcı adınız veya şifreniz yanlış.',
        );
        setUsername('');
        setPassword('');
      }
    }
    // data.map(item => {
    //   console.log('ITEM: ', item.id);
    // });
  }, [data]);

  return (
    <ImageBackground style={styles.background}>
      <Text style={styles.head}>Sisteme Giriş</Text>
      <Text style={styles.title}>Yeşilpınar İkizler Market</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Kullanıcı Adı</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={text => setUsername(text)}
          placeholder="Kullanıcı adı"
          placeholderTextColor="gray"
        />
        <Text style={styles.label}>Şifre</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          placeholder="Şifre"
          placeholderTextColor="gray"
        />
        <Button
          title="Giriş Yap"
          color="#00b8d4"
          onPress={() => handeClick()}
        />
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: 'black',
  },
  head: {
    fontSize: 50,
    marginBottom: 5,
    color: '#fff',
  },
  title: {
    fontSize: 25,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: 'green',
    borderRadius: 10,
    padding: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'gray',
  },
  button: {
    backgroundColor: '#0000FF',
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
