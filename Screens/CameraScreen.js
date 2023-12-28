import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Linking, Dimensions} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useDispatch} from 'react-redux';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {setBarcodeId} from '../features/productReducer';

const CameraScreen = () => {
  const [barcode, setBarcode] = useState('');
  const devices = useCameraDevices();
  const device = devices.back;
  const [isScanned, setIsScanned] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const [frameProcessor, barcodes] = useScanBarcodes([
    BarcodeFormat.ALL_FORMATS,
  ]);

  const requestCameraPermission = useCallback(async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);

  // Ürünleri ilk okuduğu zaman
  useEffect(() => {
    //Barkod sürekli değişiyor. isScanned değişkeni varsayılan
    // olarak false değerinde. Bu da barkod kameraya tutulduğu zaman sürekli
    //toogleActiveState fonksiyonun tetiklenmesine engel olur.
    if (isScanned === false) {
      toogleActiveState();
    }
  }, [barcodes]);

  useEffect(() => {
    //productSlice'deki barcod değişkenini değiştirir
    // isScanned false olduğu sürece burası çalışmaz! Ç
    isScanned && dispatch(setBarcodeId(barcode));
  }, [barcode]);

  const waitToogle = () => {
    // Beklemeden sonra tarama işleminin bittiği doğrulanır ve
    //toogleActiveState fonksiyonu tekrar erişebilir hale gelir.
    setIsScanned(false);
  };

  // Okunan barkod burada filterenerek bulunur
  const toogleActiveState = async () => {
    //Redux Statedeki 'barcod' değişkenini sürekli sıfırlamalıyız!
    //Yoksa aynı ürün okutulduğunda HomeScreen'de herhangi bir değişiklik olmaz!
    dispatch(setBarcodeId(''));
    setBarcode('');

    if (barcodes && barcodes.length > 0) {
      barcodes.forEach(async scannedBarcode => {
        if (scannedBarcode.rawValue !== '') {
          //Veriler okunduktan sonra çıkan sonuc setBarcode tanımlanır
          // ve setIsScanned true değerine dönerilir.
          setIsScanned(true);
          setBarcode(scannedBarcode.rawValue);
        }
      });
    }
    //Sürekli okuma yapmaması için yarım saniyelik bir bekleme
    setTimeout(waitToogle, 500);
  };

  const renderCamera = () => {
    if (devices && devices.back) {
      return (
        <View>
          <Camera
            style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height / 3,
            }}
            device={device}
            isActive={true}
            enableZoomGesture
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
          {barcode ? (
            <View>
              <Text
                style={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  color: 'red',
                }}>
                Taranan kod: {barcode}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                color: 'red',
              }}>
              Lütfen bir kod tarayın
            </Text>
          )}
        </View>
      );
    } else {
      return <View style={{flex: 1}} />;
    }
  };

  return <View>{renderCamera()}</View>;
};

export default CameraScreen;
