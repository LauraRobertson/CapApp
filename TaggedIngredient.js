import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
} from 'react-native';

import ListView from './ListView';

function url(input) {
  input = input.replace(new RegExp(' ', 'g'), '+');
  return `https://skincare-api.herokuapp.com/ingredient?q=${input}`;
}

export default class SearchIngredients extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'Glycolic acid',
      isLoading: false,
      message: '',
      selectedTab: 'welcome',
      ingredients: [],
    };
  }

  _onSearchTextChanged = (event) => {
    this.setState({ searchString: event.nativeEvent.text });
  };

  _onSearchPressed = () => {
    const query = url(this.state.searchString);
    this._query(query);
  };

  _query = (query) => {
    this.setState({ isLoading: true });
    fetch(query)
      .then(response => response.json())
      .then(json => this._response(json))
      .catch(error =>
        this.setState({
          isLoading: false,
          message: `An error occured ${error}`
        }));
  };

  _response = (response) => {
    this.setState({ isLoading: false, message: '' });
    if (response.length) {
      this.setState({
        isLoading: false,
        message: '',
        selectedTab: 'welcome',
        ingredients: response,
      });
    } else {
      this.setState({ message: 'No results. Please try again.'});
    }
  };

  render() {
    const spinner = this.state.isLoading ?
      <ActivityIndicator size='large'/> : null;

    return (
      <View style={styles.container}>

        <Text style={styles.description}>
        SEARCH INGREDIENTS
        </Text>

        <View style={styles.flowRight}>

          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this._onSearchTextChanged}
            placeholder="Search"
          />
          <Button
            onPress={this._onSearchPressed}
            color="#333333"
            title="GO"
          />
        </View>
        {spinner}
        <ListView
          ingredients={this.state.ingredients}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
    paddingBottom: 5,
    color: '#333333',
    marginBottom: 10,
  },
  container: {
    padding: 30,
    marginTop: 85,
    alignItems: 'center',
    flex: 1,
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    fontWeight: '200',
    height: 36,
    padding: 4,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: '#333333',
    color: '#333333',
  },
});
