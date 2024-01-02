import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import List from "./app/screens/List";
import Details from "./app/screens/Details";
import Login from "./app/screens/Login";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./firebaseConfig";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

const InsideLayout = () => {
    return (
        <InsideStack.Navigator>
            <InsideStack.Screen
                name="My Todos"
                component={List}
                options={{
                    headerRight: () => (
                        <TouchableOpacity onPress={() => FIREBASE_AUTH.signOut()} style={styles.appButtonContainer}>
                            <Text style={styles.appButtonText}>Logout</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <InsideStack.Screen name="Details" component={Details} />
        </InsideStack.Navigator>
    );
};
export default function App() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
        });
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                {user ? (
                    <Stack.Screen
                        name="Inside"
                        component={InsideLayout}
                        options={{
                            headerShown: false,
                        }}
                    />
                ) : (
                    <Stack.Screen name="Login" component={Login} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    appButtonText: {
        color: "blue",
        fontWeight: "bold",
        alignSelf: "center",
    },
});
