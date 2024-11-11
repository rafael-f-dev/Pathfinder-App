import React, {useEffect, useState} from 'react';
import { MD3DarkTheme as DefaultTheme, Text, PaperProvider } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';

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

    const [trips, setTrips] = useState([]);

    useEffect(()=>{
      _retrieveData();
      
    },[]);

    const _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('trips');
        let bringBackToArray= JSON.parse(value);
        setTrips([...bringBackToArray]);
    } catch (error) {
  
      }
    };

    const _storeData = async (value) => {
      try {
        await AsyncStorage.setItem('trips', JSON.stringify(value) );
      } catch (error) {
  
      }
    };

    const removeTrip = (idx) => {
      const temp = [...trips]
      temp.splice(idx, 1)
      setTrips([...temp])
      _storeData(temp)
  }

    const showTrips = () => {
      trips.map((trip, idx) => {
        return <View key={idx}>
          <Text>{trip}</Text>
          <Button onPress={() => removeTrip(idx)}>X</Button>
        </View>
      })
    }
   
    return (<PaperProvider theme={theme}>
            <SafeAreaView style={styles.container}>
              <Text style={styles.title} >I am History</Text>
              {showTrips()}
            </SafeAreaView>
            </PaperProvider>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default History;