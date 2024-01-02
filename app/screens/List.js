import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Entypo } from "@expo/vector-icons";
import { format } from "date-fns";

export default function List({ navigation }) {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState("");
    const [loading, setLoading] = useState(false);
    const currentDate = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    useEffect(() => {
        const todoRef = collection(FIRESTORE_DB, "todos");

        const subscriber = onSnapshot(todoRef, {
            next: (snapshot) => {
                const todos = [];
                snapshot.docs.forEach((doc) => {
                    // console.log(todoData);
                    const todoData = doc.data();
                    if (todoData?.userId === FIREBASE_AUTH.currentUser.uid) {
                        todos.push({
                            id: doc.id,
                            ...todoData,
                        });
                    }
                });
                todos.sort((a, b) => {
                    const releaseDateA = new Date(a.releaseDate);
                    const releaseDateB = new Date(b.releaseDate);
                    return releaseDateB - releaseDateA;
                });
                setTodos(todos);
            },
        });

        return () => subscriber();
    }, []);

    const addTodo = async () => {
        setLoading(true);
        try {
            const doc = await addDoc(collection(FIRESTORE_DB, "todos"), {
                userId: FIREBASE_AUTH.currentUser.uid,
                title: todo,
                done: false,
                releaseDate: currentDate,
            });
        } catch (error) {
            console.log(error.message);
        } finally {
            setLoading(false);
            setTodo("");
        }
    };

    const renderTodo = ({ item }) => {
        const ref = doc(FIRESTORE_DB, `todos/${item.id}`);

        const toggleDone = async () => {
            updateDoc(ref, { done: !item.done });
        };
        const deleteItem = async () => {
            deleteDoc(ref);
        };

        return (
            <View style={styles.todoContainer}>
                <TouchableOpacity onPress={toggleDone} style={styles.todo}>
                    {item.done ? (
                        <>
                            <Ionicons name="md-checkmark-circle" size={24} color="green" />
                            <Text style={[styles.todoText, styles.todoTextDone]}>{item.title}</Text>
                        </>
                    ) : (
                        <>
                            <Entypo name="circle" size={24} color="black" />
                            <Text style={styles.todoText}>{item.title}</Text>
                        </>
                    )}
                </TouchableOpacity>
                <Ionicons name="trash-bin-outline" size={24} color="red" onPress={deleteItem} />

                <TouchableOpacity onPress={() => navigation.navigate("Details")}>
                    <Text style={styles.details}>Open Details</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input} placeholder="Add new todo" onChangeText={setTodo} value={todo} />

                {loading ? (
                    <TouchableOpacity style={styles.appButtonContainer}>
                        <ActivityIndicator style={styles.appButtonText} size="small" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={addTodo} disabled={todo === ""} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>Add Todo</Text>
                    </TouchableOpacity>
                )}
            </View>
            {todos.length > 0 && (
                <View>
                    <FlatList data={todos} renderItem={renderTodo} keyExtractor={(todo) => todo.id} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
    },
    form: {
        marginVertical: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#fff",
    },
    todoContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        marginVertical: 4,
    },
    todoText: {
        flex: 1,
        paddingHorizontal: 4,
    },
    todo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    appButtonContainer: {
        marginLeft: 4,
        elevation: 8,
        backgroundColor: "blue",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginVertical: 4,
        minWidth: 85,
    },
    appButtonText: {
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    },
    todoTextDone: {
        textDecorationLine: "line-through",
    },
    details: {
        fontSize: 12,
        color: "#000",
        alignSelf: "center",
        textTransform: "uppercase",
        marginLeft: 4,
    },
});
