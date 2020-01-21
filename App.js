import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TextInput, TouchableOpacity  } from 'react-native';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            oldTestimony: 101,
            curTestimony: 0,
            cost: 0,
            potr: 0,
            dateNow: '',
            dateTestimony: '',
            dateTestimonyStamp: '',
            dateNowStamp: '',
            days: 0,
            hours: 0,
            mins: 0,
            secs: 0,
            oldConsumption: 0,
            consumption: 0,
            consumptionRub: 0,
            timePassed: 0
        }
        this.setStorage = this.setStorage.bind(this);
        this._storeData = this._storeData.bind(this);
        this._changeInput = this._changeInput.bind(this);
        this._retrieveData = this._retrieveData.bind(this);
    }

    UNSAFE_componentWillMount() {
        let now = new Date();
        let dateNow = now.toLocaleDateString();

        this.setState({dateNow});
        this._retrieveData();
    }

    _storeData = async (oldTestimony, dateNow, consumption, consumptionRub) => {
      try {
        await AsyncStorage.setItem('oldTestimony', oldTestimony);
        await AsyncStorage.setItem('date', dateNow);
        await AsyncStorage.setItem('dateTestimonyStamp', Date.now());
        await AsyncStorage.setItem('consumption', consumption);
        await AsyncStorage.setItem('consumptionRub', consumptionRub);
        this.setState({oldTestimony})
      } catch (error) {
        console.log(error);
      }
    };

    _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('oldTestimony');
        const dateTestimony = await AsyncStorage.getItem('date');
        const dateTestimonyStamp = await AsyncStorage.getItem('dateTestimonyStamp');
        const oldConsumption = await AsyncStorage.getItem('consumption');
        let timePassed = (Date.now() - dateTestimonyStamp) / 1000;
        console.log('now ', Date.now());
        console.log('dateTestimonyStamp ', dateTestimonyStamp);
        console.log('timePassed ', timePassed);
        console.log('dateTestimony ', dateTestimony);
        if (value !== null) {
          // We have data!!
          console.log('value ', value);
          this.setState({oldTestimony: value, dateTestimony, dateTestimonyStamp, oldConsumption, timePassed })
        }
      } catch (error) {
        console.log('Ашыпка получения ', error);
      }
    };

    _changeInput(text) {
        let cost = (parseFloat(text) - 101) * 5.5;
        let dateNowStamp = Date.now();

        let { timePassed } = this.state;


        this.setState({curTestimony: text, cost, dateNowStamp})

        // let timePassed = (dateNowStamp - this.state.dateTestimonyStamp) / 1000;
        let days = Math.floor(timePassed / 3600 / 24);
        let hours = Math.floor(timePassed / 3600) - days * 24;
        let mins = Math.floor(timePassed / 60) - days * 24 * 60 - hours * 60;
        let secs = Math.floor(timePassed % 60);

        let fullMins = timePassed / 60;

        let potr = (parseFloat(text) - this.state.oldTestimony) * 5.5;
        let consumption = (potr / fullMins).toFixed(2);
        let consumptionRub = (consumption * 5.5).toFixed(2);
        this.setState({potr, days, hours, mins, secs, consumption, consumptionRub})
    }

    setStorage(oldTestimony) {
        AsyncStorage.setItem('oldTestimony', oldTestimony);
    }

    render() {
        const { oldTestimony, curTestimony, dateNow, cost, potr, dateTestimony, days, hours, mins, consumption, consumptionRub, oldConsumption } = this.state;
        return (
          <View style={styles.container}>
            <TextInput
                style={styles.input}
                editable={true}
                onChangeText = {(text) => {this._changeInput(text)}}
                />
            <Text style={styles.textOld}>Показания на дату {dateTestimony}: {(oldTestimony)?oldTestimony:'нетути'}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress = {(e) => {this._storeData(curTestimony, dateNow, consumption, consumptionRub)}}
            >
              <Text style={styles.btnText}> ЗАНЕСТИ ПОКАЗАНИЯ </Text>
            </TouchableOpacity>

            <Text style={styles.cost}>{cost}</Text>

            <Text style={styles.cost}>Нагорело: {potr}</Text>

            <View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between', width:'100%'}}>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', width:'100%'}}>
                    <Text style={styles.timePassed}>Дней: {days}</Text>
                    <Text style={styles.timePassed}>Часов: {hours}</Text>
                    <Text style={styles.timePassed}>Минут: {mins}</Text>
                </View>
                <View>
                    <Text style={styles.timePassed}>Расход газа: {consumption} m3 в мин, {(consumption*60).toFixed()} в час, {(consumption*60*24).toFixed()} в день</Text>
                    <Text style={styles.timePassed}>Расход руб: {consumptionRub} в мин, {(consumptionRub*60).toFixed()} в час, {(consumptionRub*60*24).toFixed()} в день</Text>
                    <Text style={styles.timePassed}>Прошлый расход: {oldConsumption} m3 в час</Text>
                </View>
            </View>
          </View>
        );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
  input: {
      backgroundColor: '#dedede',
      width: 200,
      fontSize: 34,
      borderWidth: 1,
      borderColor: '#d6d7da',
      borderRadius: 4
  },
  textOld: {
      fontSize: 30,
      alignItems: 'center',
  },
  button: {
      borderRadius: 7,
      width: 'auto',
      backgroundColor: '#2196f3',
      marginTop: 50
  },
  btnText: {
      fontSize: 30,
      color: 'yellow',
  },
  cost: {
      width: 'auto',
      fontSize: 44,
  },
  timePassed: {
      fontSize: 20,
      alignItems: 'center'
  }
});
