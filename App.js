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
            dateNowStamp: ''
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

    _storeData = async (oldTestimony, dateNow) => {
      try {
        await AsyncStorage.setItem('oldTestimony', oldTestimony);
        await AsyncStorage.setItem('date', dateNow);
        await AsyncStorage.setItem('dateTestimonyStamp', Date.now());
        this.setState({oldTestimony})
      } catch (error) {
        console.log(error);
      }
    };

    _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('oldTestimony');
        const dateTestimony = await AsyncStorage.getItem('date');
        console.log('dateTestimony ', dateTestimony);
        if (value !== null) {
          // We have data!!
          console.log('value ', value);
          this.setState({oldTestimony: value, dateTestimony })
        }
      } catch (error) {
        console.log('Ашыпка получения ', error);
      }
    };

    _changeInput(text) {
        let cost = (parseFloat(text) - 101) * 5.5;

        this.setState({curTestimony: text, cost})

        let potr = (parseFloat(text) - this.state.oldTestimony) * 5.5;
        this.setState({potr})
    }

    setStorage(oldTestimony) {
        AsyncStorage.setItem('oldTestimony', oldTestimony);
    }

    render() {
        const { oldTestimony, curTestimony, dateNow, cost, potr, dateTestimony } = this.state;
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
              onPress = {(e) => {this._storeData(curTestimony, dateNow)}}
            >
              <Text style={styles.btnText}> ЗАНЕСТИ ПОКАЗАНИЯ </Text>
            </TouchableOpacity>

            <Text style={styles.cost}>{cost}</Text>

            <Text style={styles.cost}>Нагорело: {potr}</Text>

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
  }
});
