import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Button, TextInput, TouchableOpacity  } from 'react-native';

export default class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            oldTestimony: 777,
            curTestimony: 0,
            cost: 0,
            potr: 0
        }
        this.setStorage = this.setStorage.bind(this);
        this._storeData = this._storeData.bind(this);
        this._changeInput = this._changeInput.bind(this);
        this._retrieveData = this._retrieveData.bind(this);
    }

    componentWillMount() {
        console.log('componentWillMount');
        this._retrieveData();
    }

    _storeData = async (oldTestimony) => {
      try {
        await AsyncStorage.setItem('oldTestimony', oldTestimony);
        this.setState({oldTestimony})
      } catch (error) {
        console.log(error);
      }
    };

    _retrieveData = async () => {
      try {
        const value = await AsyncStorage.getItem('oldTestimony');
        if (value !== null) {
          // We have data!!
          console.log('value ', value);
          this.setState({oldTestimony: value})
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
        return (
          <View style={styles.container}>
            <TextInput
                style={styles.input}
                editable={true}
                onChangeText = {(text) => {this._changeInput(text)}}
                />
            <Text style={styles.textOld}>Предыдущие показания {(this.state.oldTestimony)?this.state.oldTestimony:'нетути'}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress = {(e) => {this._storeData(this.state.curTestimony)}}
            >
              <Text style={styles.btnText}> ЗАНЕСТИ ПОКАЗАНИЯ </Text>
            </TouchableOpacity>

            <Text style={styles.cost}>{this.state.cost}</Text>

            <Text style={styles.cost}>Нагорело: {this.state.potr}</Text>

          </View>
        );
    }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: '30px'
    // justifyContent: 'center',
  },
  input: {
      backgroundColor: '#dedede',
      width: 'auto',
      fontSize: '34px',
      borderWidth: '1px',
      borderColor: '#d6d7da',
      borderRadius: 4,
  },
  textOld: {
      fontSize: '30px',
      alignItems: 'center',
  },
  button: {
      borderRadius: 7,
      width: 'auto',
      backgroundColor: '#2196f3',
      marginTop: '50px'
  },
  btnText: {
      fontSize: '30px',
      color: 'yellow',
  },
  cost: {
      width: 'auto',
      fontSize: '44px',
  }
});
