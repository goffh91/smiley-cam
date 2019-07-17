import React from 'react';
import { FileSystem } from 'expo';
import { ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import * as FaceDetector from 'expo-face-detector';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components';

const { width, height } = Dimensions.get("window");

const CenterView = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: whitesmoke;
`;

const Text = styled.Text`
  color: white;
  margin-top: 10px;
  font-size: 22px;
`;

const IconBar = styled.View`
  margin-top: 20px;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: null,
      cameraType: Camera.Constants.Type.front,
      smileDetected: null
    };
    this.cameraRef = React.createRef();
  }
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.front,
    smileDetected: null
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
    const { hasPermission, cameraType, smileDetected } = this.state;
    if (hasPermission === true) {
      return (
        <CenterView>
          <Camera 
            style={{
              width,
              height: height - 200,
              borderRadius: 2,
              overflow: 'hidden'
            }} 
            type={cameraType}
            onFacesDetected={smileDetected ? null : this.onFacesDetected}
            faceDetectorSettings={{
              detectLandmarks: FaceDetector.Constants.Landmarks.all,
              runClassifications: FaceDetector.Constants.Classifications.all
            }}
            faceDetectionClassifications="all"
            ref={this.cameraRef}
          />
          <IconBar>
            <TouchableOpacity onPress={this.switchCameraType}>
              <MaterialIcons
                name={cameraType === Camera.Constants.Type.front 
                  ? 'camera-rear' 
                  : 'camera-front'
                }
                color="gray"
                size={40}
              />
            </TouchableOpacity>
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
  switchCameraType = () => {
    const { cameraType } = this.state;
    if (cameraType === Camera.Constants.Type.front) {
      this.setState({
        cameraType: Camera.Constants.Type.back
      });
    } else {
      this.setState({
        cameraType: Camera.Constants.Type.front
      });
    }
  }
  onFacesDetected = ({ faces }) => {
    const face = faces[0];
    if (face) {
      console.log(face.smilingProbability);
      if (face.smilingProbability > 0.7) {
        console.log(face.smilingProbability + ' : take photo');
        this.setState({
          smileDetected: true
        });
        this.takePhoto();
      }
    }
  }
  takePhoto = async () => {
    try {
      if (this.cameraRef.current) {
        let { uri } = await this.cameraRef.current.takePictureAsync({
          quality: 1,
          exif: true
        });
        if (uri) {
          this.savePhoto(uri);
        }
      }
    } catch(error) {
      alert(error);
      this.setState({
        smileDetected: false
      })
    }
  }
  savePhoto = async(uri) => {
    
  } 
}