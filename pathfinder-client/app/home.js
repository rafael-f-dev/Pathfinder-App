import React, { useState, useEffect, useContext} from 'react';
import { TouchableOpacity, FlatList, Keyboard, StyleSheet, SafeAreaView, View, StatusBar } from "react-native";
import { MD3DarkTheme as DefaultTheme, Searchbar, Text, Button, PaperProvider, ActivityIndicator, Divider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { en, registerTranslation } from 'react-native-paper-dates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TripContext } from './tripcontext.js'; 
registerTranslation('en', en);

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

const Home = () => {


  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);

  const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
  const [rangeOpen, setRangeOpen] = useState(false);

  const [tripSelected, setTripSelected] = useState(false);

  const { trips, setTrips } = useContext(TripContext);

  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState({
   name:"",
   message:"",
  });

  const [showOutput, setShowOutput] = useState(false);

  useEffect(()=>{
    if (selectedCity !== null && (range.startDate !== undefined && range.endDate !== undefined)) {
      setTripSelected(true);
    } else {
      setTripSelected(false);
    }

    _retrieveData();
  },[selectedCity, range])

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('trips');
      let bringBackToArray= JSON.parse(value);
      setTrips([...bringBackToArray]);
  } catch (error) {
     console.log(error);
    }
  };

  const fetchCities = async () => {
    if (!query.trim()) {
      return; 
    }
    setLoading(true);

    try {
      const response = await axios.post('http://192.168.1.76:4040/search-city', { query });
      const validCities = response.data.results;
      setCities(validCities);
    } catch (error) {
      console.error('Error fetching city data:', error);
      setCities([]);
    }
    setLoading(false);
    Keyboard.dismiss();
  };

  const handleChangeText = (text) => {
    setQuery(text);
  };

  const handleCitySelect = (city) => {
    setQuery(city.properties.formatted); 
    setSelectedCity(city.properties.formatted); 
    setCities([]); 
  };

  const onDismiss = React.useCallback(() => {
    setRangeOpen(false);
  }, [setRangeOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setRangeOpen(false);
      setRange({ startDate, endDate });
    },
    [setRangeOpen, setRange]
  );

  const generateTrip = async () => {
     const newStartDate = range.startDate.toDateString();
     const newEndDate = range.endDate.toDateString();

     setPrompt(`Generate an itinerary for a trip to ${selectedCity}, from ${newStartDate} until ${newEndDate},
                present it in a simple, mobile-friendly way, with functional google maps links to each location.
                No accomodation suggestions, but present it in the way of a friendly trip planner.`)

     setLoading(true);
    
    try {
       const response = await axios.post('http://192.168.1.76:4040/generate', {
         prompt: prompt,
       });

       const newOutput = {
        name: `Trip to ${selectedCity} from ${newStartDate} until ${newEndDate}`,
        message: response.data.text,
      };
 
      const updatedTrips = [...trips, newOutput];
 
      setOutput(newOutput);
      setTrips(updatedTrips); 
      _storeData(updatedTrips);
      setShowOutput(true);
       
     } catch (err) {
        console.log(err);
     } finally {
        setLoading(false);
     }
  }

  const backHomeAndClear = () => {
    const newOutput2 = {
      name: "",
      message: "",
    };

    const newRange = {
      startDate: undefined,
      endDate: undefined,
    }

    setOutput(newOutput2);
    setRange(newRange);
    setShowOutput(false);
    setSelectedCity(null);
    setQuery('');
    setPrompt('');
  }

  const _storeData = async (trips) => {
    try {
      await AsyncStorage.setItem('trips', JSON.stringify(trips));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaProvider>
    <PaperProvider theme={theme}>
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
    <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      {showOutput === false ? 
      <View>
      <Text style={[styles.title, {color: theme.colors.secondary}]}>Where to next?</Text>

      <Searchbar
        style={[styles.searchbar, {color: theme.colors.secondary}]}
        placeholder="Enter a city,  e.g: 'Barcelona, Spain' "
        placeholderTextColor='#4c5b48'
        value={query}
        onChangeText={handleChangeText}
        />

        <Button style={styles.button} mode='contained' onPress={fetchCities}>Search</Button>
      
        {cities.length > 0 && !loading && (
        <FlatList
          style={[styles.flatlist, {color: theme.colors.onSecondary}]}
          data={cities}
          keyExtractor={(item) => item.properties.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleCitySelect(item)}>
              <Divider/>
              <Text style={styles.flatlist_text}>{item.properties.formatted}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {loading && <ActivityIndicator animating={true} size="large" color={theme.colors.secondary}/>}

      {range.startDate !== undefined && range.endDate !== undefined ? Object.values(range).map((date,idx)=> {
      return (<Text style={[styles.dates, {color: theme.colors.secondary}]} key={idx}>{date.toDateString()}</Text>)}) 
      : null }

      <Button style={styles.button} onPress={() => setRangeOpen(true)} uppercase={false} mode="outlined">
          Pick dates
        </Button>
        <DatePickerModal
          disableStatusBarPadding
          locale="en"
          mode="range"
          visible={rangeOpen}
          onDismiss={onDismiss}
          startDate={range.startDate}
          endDate={range.endDate}
          onConfirm={onConfirm}
          startYear={2024}
          endYear={2025}
          presentationStyle="pageSheet"
        />

       {tripSelected ?
       <Button style={styles.button} onPress={generateTrip} mode='contained' >Generate Trip</Button> : null}
       </View>
       : 
       <View style={styles.container}>
       <Text style={styles.title}>{output.name}</Text>
       <Text style={styles.flatlist_text}>{output.message}</Text>
       <Button style={styles.button} onPress={backHomeAndClear} mode='contained'>Generate New Trip</Button>
       </View>}
    </SafeAreaView>
    </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 10,
  },
  searchbar: {
    margin: 10,
  },
  button: {
    margin: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  flatlist: {
    margin: 10,
  },
  flatlist_text: {
    fontSize: 15,
    marginVertical: 10,
  },
  dates: {
    textAlign: 'center',
    fontSize: 15,
    marginVertical: 10,
    fontWeight: "bold",
  }
});

export default Home;
