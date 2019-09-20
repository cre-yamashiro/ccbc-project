import React, {Component} from 'react';
import ReactNative, {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

export default class MyComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._handleKeyboardWillShow.bind(this));
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
  }

  render() {
    return (
      <ScrollView
        ref={(component) => this._scrollview = component}
        style={styles.container}
      >
        <View
          style={styles.dummy}
        />
        <TextInput
          ref={(component) => this._textinput = component}
          style={styles.input}
        />
        <View
          style={styles.dummy}
        />
      </ScrollView>
    );
  }

  _handleKeyboardWillShow() {
    const responder = this._scrollview.getScrollResponder();
    responder.scrollResponderScrollNativeHandleToKeyboard(
      ReactNative.findNodeHandle(this._textinput),
      100,
      true
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  dummy: {
    height: 1000
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#000000'
  }
});