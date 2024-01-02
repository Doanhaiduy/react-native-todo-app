import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            Alert.alert("Login failed!", error.message);
        } finally {
            setLoading(false);
        }
    };

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            Alert.alert("Success!", "Register successfully!");
        } catch (error) {
            Alert.alert("Sign up failed!", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} value={email} />
                    <TextInput
                        style={styles.input}
                        textContentType="password"
                        secureTextEntry
                        placeholder="Password"
                        onChangeText={setPassword}
                        value={password}
                    />

                    {loading ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <>
                            <TouchableOpacity onPress={signIn} style={styles.appButtonContainer}>
                                <Text style={styles.appButtonText}>Login</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={signUp} style={styles.appButtonContainer}>
                                <Text style={styles.appButtonText}>Signup</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        paddingVertical: 20,
        marginTop: 200,
    },
    form: {
        marginVertical: 20,
        alignItems: "center",
    },

    input: {
        marginVertical: 4,
        width: "80%",
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: "#fff",
    },
    appButtonContainer: {
        width: "50%",
        elevation: 8,
        backgroundColor: "blue",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginVertical: 4,
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
    },
    details: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
    },
});
