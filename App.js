import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Camera, Permissions } from "expo";

export default class App extends React.Component {
  state = {
    hasPermission: null
  };
  componentDidMount = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === "granted") {
      this.setState({ hasPermission: true });
    } else {
      this.setState({ hasPermission: false });
    }
  };
  render() {
    const { hasPermission } = this.state;
    if (hasPermission === true) {
      return (
        <View>
          <Text>Has permissions</Text>
        </View>
      );
    } else if (hasPermission === false) {
      return (
        <View>
          <Text>Don't have permission for this</Text>
        </View>
      );
    } else {
      return <ActivityIndicator />;
    }
  }
}