/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CameraScreen from './CameraScreen';
import LinearGradient from 'react-native-linear-gradient';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import MaterialIcon from 'react-native-vector-icons/SimpleLineIcons';

const HomeScreen = () => {
  const [urunler, setUrunler] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [toplamFiyat, setToplamFiyat] = useState(0);
  const [tAdet, setTAdet] = useState(0);

  const flatListRef = useRef();

  // productSlice'deki barcod tanımlanmıştır.
  const barcod = useSelector(state => state.products.barcod);

  // barcod sürekli dinlenir. Ve değişiklik olduğunda 'setBarcode' ile
  // barcode değişkenine atanır.
  useEffect(() => {
    setBarcode(barcod);
  }, [barcod]);

  // barcode değiştikten sonra handleBarkodOkut fonksiyonu çağrılır
  useEffect(() => {
    handleBarkodOkut();
  }, [barcode]);

  // barcode'yi id kullanarak ilgili ürünün bilgileri firebase
  // veritabanından çekilir!
  const handleBarkodOkut = async () => {
    await firestore()
      .collection('marketdb')
      .doc(barcode)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          try {
            const barkodData = documentSnapshot.data();

            //updateUrunler isimli içinde 'urunler' dizisini bulunduran bir
            //dizi oluşturulur
            const updatedUrunler = [...urunler];
            //urun id'si gönderilen barcode'ye eşitse ürünün
            //updateUrunler deki indexi bulunur
            const urunIndex = updatedUrunler.findIndex(
              urun => urun.id === barcode,
            );

            // Eğer listede aynı ürün varsa adeti ürün adedi bir adet artırılır!
            if (urunIndex > -1) {
              updatedUrunler[urunIndex].adet += 1;
              updatedUrunler[urunIndex].fiyat = barkodData.product_price;
            } else {
              // Eğer ürün listede yoksa yenisi eklenir!
              updatedUrunler.push({
                id: barcode,
                ad: barkodData.product_name,
                adet: 1,
                fiyat: barkodData.product_price,
              });
            }
            // updateUrunler setUrunler'e set edilir
            setUrunler(updatedUrunler);
            setBarcode('');
          } catch (error) {
            setBarcode('');
          }
        } else {
        }
      });
  };

  const resetData = () => {
    //Dataları sıfırlar!
    setBarcode('');
    setUrunler([]);
    setTAdet(0);
    setTAdet(0);
  };

  const handleUrunSil = urunId => {
    const updatedUrunler = urunler.filter(urun => urun.id !== urunId);
    setUrunler(updatedUrunler);
  };

  const handleUrunArttir = urunId => {
    const updatedUrunler = [...urunler];
    const urunIndex = updatedUrunler.findIndex(urun => urun.id === urunId);
    if (urunIndex > -1) {
      updatedUrunler[urunIndex].adet += 1;
      setUrunler(updatedUrunler);
    }
  };

  const handleUrunAzalt = urunId => {
    const updatedUrunler = [...urunler];
    const urunIndex = updatedUrunler.findIndex(urun => urun.id === urunId);
    if (urunIndex > -1) {
      if (updatedUrunler[urunIndex].adet > 1) {
        updatedUrunler[urunIndex].adet -= 1;
        setUrunler(updatedUrunler);
      }
    }
  };

  // const veri = [
  //   {
  //     id: 'aa342342342342342',
  //     ad: 'Ürün Adı Ürün Adı ',
  //     adet: 1,
  //     fiyat: 27.5,
  //   },
  //   {
  //     id: '342342342342343',
  //     ad: 'Ürün Adı Ürün Adı ',
  //     adet: 1,
  //     fiyat: 27.5,
  //   },
  // ];

  const returnProductCard = item => {
    console.log('ITEM ID:');
    return (
      <View key={item.item.id}>
        <Text
          style={{
            color: 'black',
            fontWeight: 'bold',
            fontSize: 20,
          }}>
          {item.index + 1}
        </Text>
        <View style={styled.item_card}>
          <View style={{margin: 2}}>
            <Text style={styled.item_text}>{item.item.ad}</Text>
          </View>
          <Text style={styled.item_adet_fiyat}>
            Adet Fiyat.: {item.item.fiyat} TL
          </Text>
          <Text style={styled.item_adet}>Ürün Adedi: {item.item.adet}</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styled.button_native}
              onPress={() => handleUrunAzalt(item.item.id)}>
              <Text
                style={{
                  color: 'white',
                }}>
                {'-'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styled.button_positive}
              onPress={() => handleUrunArttir(item.item.id)}>
              <Text
                style={{
                  color: 'white',
                }}>
                {'+'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styled.button_delete}
              onPress={() => handleUrunSil(item.item.id)}>
              <Text
                style={{
                  color: 'white',
                }}>
                {'SİL'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styled.item_fiyat}>
            Toplam Fiyat: {item.item.fiyat * item.item.adet} TL
          </Text>
        </View>
      </View>
    );
  };

  // Toplam ürün fiyatları
  const toplam = () => {
    let toplamFiyat = 0;
    urunler.forEach(urun => {
      toplamFiyat += urun.fiyat * urun.adet;
    });
    setToplamFiyat(toplamFiyat);
  };

  // Toplam ürün adedi
  const toplamAdet = () => {
    let toplamAdet = 0;
    urunler.forEach(urun => {
      toplamAdet += urun.adet;
    });
    setTAdet(toplamAdet);
  };

  // urunler statesi değiştiğinde olacak olanlar
  useEffect(() => {
    toplam();
    toplamAdet();
  }, [urunler]);

  // useEffect(() => {
  //   flatListRef.current.scrollToEnd({
  //     animated: true,
  //   });
  // }, [urunler]);

  return (
    <LinearGradient colors={['blue', 'aqua', 'white']} style={{flex: 1}}>
      <CameraScreen />
      <View style={styled.view}>
        {/* <TextInput placeholder="Barkod numarası" style={styled.inputs} /> */}
        <View style={styled.view_sales}>
          <Button onPress={() => resetData()} title="Sıfırla" />
          <Text
            style={{
              marginLeft: 10,
              fontSize: 20,
              color: 'black',
            }}>
            Toplam Adet: {tAdet} -{'>'} Toplam Fiyat: {toplamFiyat}
            <MaterialIcon name="home" style={{color: 'red', fontSize: 50}} />
          </Text>
        </View>

        <FlatList
          data={urunler}
          renderItem={returnProductCard}
          ref={flatListRef}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingBottom: Dimensions.get('window').height / 3,
            flexDirection: 'column-reverse',
          }}
        />
        <View>
          <Text style={{backgroundColor: 'red'}}>.</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;

const styled = StyleSheet.create({
  view: {
    width: Dimensions.get('window').width,
    height: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0)',
    alignItems: 'center',
  },
  products_view: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2,
  },

  inputs: {
    height: 40,
    width: Dimensions.get('window').width - 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'teal',
  },
  item_card: {
    width: Dimensions.get('window').width,
    height: 'auto',
    backgroundColor: 'rgba(139,101, 139, 0.9)',
    marginTop: 5,
    padding: 5,
    flexDirection: 'row',
    minHeight: 50,
    flexWrap: 'wrap',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    alignItems: 'center',
  },
  item_text: {
    margin: 10,
    marginBottom: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  item_adet_fiyat: {
    margin: 10,
    marginBottom: 1,
    fontSize: 15,
    color: 'white',
  },

  item_adet: {
    margin: 10,
    marginBottom: 1,
    fontSize: 15,
    color: 'white',
  },
  item_fiyat: {
    margin: 10,
    marginBottom: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  button_native: {
    marginLeft: 10,
    borderColor: 'purple',
    borderWidth: 2,
    width: 50,
    height: 25,
    alignItems: 'center',
    backgroundColor: 'purple',
    borderRadius: 5,
  },
  button_positive: {
    marginLeft: 10,
    borderColor: 'green',
    borderWidth: 2,
    width: 50,
    height: 25,
    alignItems: 'center',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  button_delete: {
    marginLeft: 10,
    borderColor: '#79cdcd',
    borderWidth: 2,
    width: 50,
    height: 25,
    alignItems: 'center',
    backgroundColor: '#79cdcd',
    borderRadius: 5,
  },

  view_sales: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});
