import React, {useEffect, useContext} from 'react';
import { MD3DarkTheme as DefaultTheme, Text, PaperProvider, Button } from 'react-native-paper';
import { SafeAreaView, StyleSheet, FlatList, View, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TripContext } from './tripcontext.js'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const History = () => {

    const theme = {
        ...DefaultTheme,
        colors: {
          "primary": "rgb(130, 219, 126)",
          "onPrimary": "rgb(0, 57, 10)",
          "primaryContainer": "rgb(0, 83, 18)",
          "onPrimaryContainer": "rgb(157, 248, 152)",
          "secondary": "rgb(186, 204, 179)",
          "onSecondary": "rgb(37, 52, 35)",
          "secondaryContainer": "rgb(59, 75, 56)",
          "onSecondaryContainer": "rgb(213, 232, 206)",
          "tertiary": "rgb(160, 207, 212)",
          "onTertiary": "rgb(0, 54, 59)",
          "tertiaryContainer": "rgb(31, 77, 82)",
          "onTertiaryContainer": "rgb(188, 235, 240)",
          "error": "rgb(255, 180, 171)",
          "onError": "rgb(105, 0, 5)",
          "errorContainer": "rgb(147, 0, 10)",
          "onErrorContainer": "rgb(255, 180, 171)",
          "background": "rgb(26, 28, 25)",
          "onBackground": "rgb(226, 227, 221)",
          "surface": "rgb(26, 28, 25)",
          "onSurface": "rgb(226, 227, 221)",
          "surfaceVariant": "rgb(66, 73, 64)",
          "onSurfaceVariant": "rgb(194, 201, 189)",
          "outline": "rgb(140, 147, 136)",
          "outlineVariant": "rgb(66, 73, 64)",
          "shadow": "rgb(0, 0, 0)",
          "scrim": "rgb(0, 0, 0)",
          "inverseSurface": "rgb(226, 227, 221)",
          "inverseOnSurface": "rgb(47, 49, 45)",
          "inversePrimary": "rgb(16, 109, 32)",
          "elevation": {
            "level0": "transparent",
            "level1": "rgb(31, 38, 30)",
            "level2": "rgb(34, 43, 33)",
            "level3": "rgb(37, 49, 36)",
            "level4": "rgb(39, 51, 37)",
            "level5": "rgb(41, 55, 39)"
          },
          "surfaceDisabled": "rgba(226, 227, 221, 0.12)",
          "onSurfaceDisabled": "rgba(226, 227, 221, 0.38)",
          "backdrop": "rgba(44, 50, 42, 0.4)"
        }
    }


    const { trips, setTrips } = useContext(TripContext);

    useEffect(()=>{
      _retrieveData();
    },[]);

    const _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('trips');
        let bringBackToArray= JSON.parse(value);
        setTrips([...bringBackToArray]);
    } catch (error) {
       console.log(error);
      }
    };

    const _storeData = async (trips) => {
      try {
        await AsyncStorage.setItem('trips', JSON.stringify(trips));
      } catch (error) {
        console.log(error);
      }
    };
  

    const removeTrip = (idx) => {
      const temp = [...trips]
      temp.splice(idx, 1)
      setTrips([...temp])
      _storeData(temp)
  }

  const renderTrip = ({ item, idx }) => (
    <View style={styles.tripContainer}>
      <Text>{item.name}</Text>
      <Button style={styles.button} mode='contained' onPress={() => removeTrip(idx)} />
    </View>
  );
   
    return (<SafeAreaProvider>
            <PaperProvider theme={theme}>
            <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
              <Text style={styles.title} >Previous Trips</Text>
              <FlatList
                data={trips}
                keyExtractor={(item, idx) => idx.toString()}
                renderItem={renderTrip}
              />
            </SafeAreaView>
            </PaperProvider>
            </SafeAreaProvider>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    margin: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  tripContainer: {
    marginBottom: 20,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default History;