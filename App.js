import React from 'react';
import { ActivityIndicator, Dimensions } from "react-native";
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components';

const { width, height } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  margin-top: 40px;
  justify-content: center;
  background-color: cornflowerblue;
`;

const Text = styled.Text`
  color: white;
  font-size: 22px;
`;

const IconBar = styled.View`
  margin-top: 50px;
`;

export default class App extends React.Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.front
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
    const { hasPermission, cameraType } = this.state;
    if (hasPermission === true) {
      return (
        <CenterView>
          <Camera 
            style={{
              width,
              height: height - 40,
              borderRadius: 10,
              overflow: 'hidden'
            }} 
            type={cameraType}
          />
          <IconBar>
            <MaterialIcons
              name={cameraType === Camera.Constants.Type.front ? 
                'camera-rear' : 'camera-front' }
              color="white"
              size={30}
            />
          </IconBar>
        </CenterView>
      );
    } else if (hasPermission === false) {
      return (
        <CenterView>
          <Text>Don't have permission for this</Text>
        </CenterView>
      );
    } else {
      return (
        <CenterView>
          <ActivityIndicator 
            size={'large'}
            color={'black'}
          />
        </CenterView>
      );
    }
  }
}