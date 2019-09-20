import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'
import { Provider, connect } from 'react-redux' // 5.0.6
import { createStore } from 'redux' // 3.7.2
import { StackNavigator } from 'react-navigation' // 1.0.0-beta.21
import { Header, Icon } from 'react-native-elements'

class Home extends Component {
  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps! nextProps: ', nextProps)
  }
  onPressLogoutButton = () => {
    this.props.navigation.navigate('Login')
  }
  onPressMenuButton = () => {
    this.props.navigation.navigate('Menu')
  }
  onPressButton = () => {
    this.props.navigation.navigate('NextScreen')
  }
  render() {
    console.log('Rendering Home')
    return (
      <View>
        <Header
          leftComponent={
            <Icon
              name={'home'}
              type={'font-awesome'}
              color="#fff"
              onPress={this.onPressMenuButton}
            />
          }
          centerComponent={{
            text: 'MVP Vote System',
            style: { color: '#fff' }
          }}
          rightComponent={
            <Icon
              name={'sign-out'}
              type={'font-awesome'}
              color="#fff"
              onPress={this.onPressLogoutButton}
            />
          }
        />
        <Text>{this.props.number}</Text>
        <Button title="Go to next screen" onPress={this.onPressButton} />
      </View>
    )
  }
}

const mapState = state => ({
  number: state.sample.number
})

export default connect(
  mapState,
  null
)(Home)
