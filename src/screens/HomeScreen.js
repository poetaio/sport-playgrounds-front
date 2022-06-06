import { useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';
import { customStorage } from '../utils/customStorage';

var locationActive = require ('../../assets/img/location_active.png');
var locationInactive = require ('../../assets/img/location_inactive.png');

const HomeScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState(null);

  const onLocationPress = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location;
    try {
      location = await Location.getCurrentPositionAsync();
    } catch (e) {
      return;
    }
    setLocationPermission(true);
    setLocation(location);
    const { coords } = location;
    const region = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    await customStorage.setLocation(region);
    setRegion((prev) => region);
  }

  useEffect(() => {
    const getStorageLocation = async () => {
      const locationFromStorage = await customStorage.getLocation();
      console.log(locationFromStorage);

      if (!locationFromStorage) {
        return;
      }

      setInitialRegion(locationFromStorage);
      setRegion(locationFromStorage);
    };

    (async () => {
      // check if location permitted
      const { status } = await Location.getForegroundPermissionsAsync();

      // if permitted get current and point to it
      if (status === 'granted') {
        let location;
        try {
          location = await Location.getCurrentPositionAsync();
        } catch (e) {
          await getStorageLocation();
          return;
        }
        setLocationPermission(true);
        const { coords } = location;
        setLocation(location);
        const region = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(region);
        setRegion(region);
        return;
      }

      // if not permitted
      // get location from storage
      await getStorageLocation();
    })();
  }, []);

  // useEffect(() => {
  //   if (location) {
  //     const {coords} = location;
  //   }
  // }, [location]);

  return (
    <View style={styles.container}>
    <MapView
      initialRegion={initialRegion}
      region={region}
      style={styles.map}
      showsUserLocation={locationPermission}
    >
      {/* <Marker
       title='Yor are here'
      //  description='This is a description'
       coordinate={initialRegion}/> */}
    </MapView>
    <TouchableOpacity onPress={onLocationPress} style={styles.myLocationButton}>
      <Image source={locationPermission ? locationActive : locationInactive}/>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  myLocationButton: {
    fontSize: 20,
    position: 'absolute',
    bottom: 20,
    right: 20,
  }
});

export default HomeScreen;