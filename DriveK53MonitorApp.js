// © 2025 Mokete Peter Motjeke. All Rights Reserved.
// DriveK53MonitorApp.js

import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

export default function DriveK53MonitorApp() {
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [violations, setViolations] = useState([]);
  const [warningIssued, setWarningIssued] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }

      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 10,
      }, (loc) => {
        setLocation(loc.coords);
        checkK53Compliance(loc.coords);
      });
    })();
  }, []);

  const checkK53Compliance = async (coords) => {
    try {
      const response = await axios.post("http://localhost:3000/check", {
        driver_id: "mock_driver_id",
        gps_data: coords,
        speed: coords.speed,
        time: new Date().toISOString()
      });

      if (response.data.violation) {
        if (!warningIssued) {
          Alert.alert("Warning", response.data.message);
          setWarningIssued(true);
        } else {
          Alert.alert("Ticket Issued", response.data.message);
          setViolations([...violations, response.data]);
        }
      }
    } catch (error) {
      console.error("Error checking compliance", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }}
        region={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : undefined}
        showsUserLocation={true}>
        {location && <Marker coordinate={location} />}
        {route.length > 0 && <Polyline coordinates={route} strokeColor="#00f" strokeWidth={3} />}
      </MapView>
      <View style={{ padding: 10 }}>
        <Text>Violations: {violations.length}</Text>
      </View>
    </View>
  );
}
