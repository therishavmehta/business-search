import React, { Component } from "react";
import MapGL, { NavigationControl, Marker } from "react-map-gl";
import RoomIcon from '@material-ui/icons/Room';


const TOKEN =
  "pk.eyJ1IjoiYWJoaWxhc2hhLXNpbmhhIiwiYSI6ImNqdzFwYWN1ajBtOXM0OG1wbHAwdWJlNmwifQ.91s73Dy03voy-wPZEeuV5Q";
const navStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "10px"
};

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 17.44212,
        longitude: 78.391384,
        zoom: 10,
        bearing: 0,
        pitch: 0,
        width: "100%",
        height: 500
      },
      markerList: [],
    };
  }

  static getDerivedStateFromProps(props) {
    const {region, coordinates} = props;
    return {viewport: {...region, zoom: 10,
      bearing: 0,
      pitch: 0,
      width: "100%",
      height: 500}, markerList:coordinates}
  }


  render() {
    const { viewport, markerList=[] } = this.state;
    return (
      <MapGL
        {...viewport}
        onViewportChange={viewport => this.setState({ viewport })}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        mapboxApiAccessToken={TOKEN}
      >
        <div className="nav" style={navStyle}>
          <NavigationControl
            onViewportChange={viewport => this.setState({ viewport })}
          />
          {markerList.map((marker, index) => {
            return (
              <div key={index}>
                {" "}
                <Marker key={`${marker.latitude}${marker.longitude}`} longitude={marker.longitude} latitude={marker.latitude}>
                  <RoomIcon color="primary" />
                </Marker>{" "}
              </div>
            );
          })}
        </div>
      </MapGL>
    );
  }
}

