import React, { Component } from 'react'
import { View, Text, Button } from 'react-native'
import { Provider, connect } from 'react-redux' // 5.0.6
import { createStore, bindActionCreators } from 'redux' // 3.7.2
import * as myActions from '../actions/sampleReducer'
import { StackNavigator } from 'react-navigation' // 1.0.0-beta.21
import { Header, Icon } from 'react-native-elements'

class NextScreen extends Component {
  onPressButton = () => {
    this.props.update()
  }
  onPressIncreaseButton = () => {
    this.props.actions.increase()
  }
  onPressDecreaseButton = () => {
    this.props.actions.decrease()
  }
  onPressButton = () => {
    this.props.update()
  }
  onPressLogoutButton = () => {
    this.props.navigation.navigate('Login')
  }
  onPressMenuButton = () => {
    this.props.navigation.navigate('Menu')
  }
  onPressHomeButton = () => {
    this.props.navigation.navigate('Home')
  }
  render() {
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
        
        <Button title="Increase store" onPress={this.onPressIncreaseButton} />
        <Button title="Decreas store" onPress={this.onPressDecreaseButton} />
        <Button title="戻る" onPress={this.onPressHomeButton} />
      </View>
    )
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     update: () => dispatch({ type: 'UPDATE' })
//   }
// }

const mapDispatch = dispatch => ({
  actions: bindActionCreators(myActions, dispatch)
})

export default connect(
  null,
  mapDispatch
)(NextScreen)
