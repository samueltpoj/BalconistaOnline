import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ImageBackground,
} from "react-native";
import axios from "axios";

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { description: "Bem-vindo ao balconista online. O que está procurando?" },
  ]);
  const [inputText, setInputText] = useState("");

  const sendMessage = async () => {
    if (messages.length != 1) {
      setMessages([
        {
          description: "Bem-vindo ao balconista online. O que está procurando?",
        },
      ]);
    }
    setMessages((prevMessages) => [
      ...prevMessages,
      { description: inputText },
    ]);
    let replaced = inputText.replace(/%20/g, " ");
    setInputText("");
    try {
      const url = `http://20.226.37.145:3000/sintoma?desc=farmacia%20${replaced}`;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
        },
      });

      const newMessage = response.data;
      if (newMessage && newMessage.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            description:
              "Tenho alguns resultados para sua pergunta, espero que atenda a sua necessidade. Para mais detalhes do produto click na imagem.",
          },
        ]);
        setMessages((prevMessages) => [...prevMessages, ...newMessage]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            description:
              "Estamos com problemas, desculpe. Tente novamente mais tarde",
          },
        ]);
        console.log("Invalid message structure:", newMessage);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          description: `Estamos com problemas, desculpe. Tente novamente mais tarde, ${error}`,
        },
      ]);
      console.log("Error sending message:", error);
    }
  };

  const renderItem = ({ item, index }) => {
    const { description, image } = item;

    const handlePress = () => {
      Linking.openURL(`https://www.farmaconde.com.br/${description}`).catch(
        (error) => {
          console.log("Error opening link:", error);
        }
      );
    };

    return (
      <>
        {image ? (
          <TouchableOpacity
            onPress={handlePress}
            style={{
              borderRadius: 10,
              padding: 10,
              marginTop: 10,
              width: "50%",
              backgroundColor: "white",
            }}
          >
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100 }}
            />
            <Text>{description}</Text>
          </TouchableOpacity>
        ) : (
          <View
            style={{
              borderRadius: 10,
              padding: 10,
              marginTop: 10,
              width: "50%",
              backgroundColor: index === 1 ? "green" : "white",
              alignSelf: index === 1 ? "flex-end" : "flex-start",
              alignItems: index === 1 ? "flex-end" : "",
            }}
          >
            <Text style={{ color: index === 1 ? "white" : "black" }}>
              {description}
            </Text>
          </View>
        )}
      </>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/whatsappbackground.png")}
      style={{ flex: 1 }}
    >
      <View
        style={{
          height: 80,
          backgroundColor: "white",
          alignItems: "center",
          flexDirection: "row",
          paddingTop: 20,
          gap: 10,
        }}
      >
        <Image
          source={require("../../assets/balconista.png")}
          style={{ width: 50, height: 50, borderRadius: 40, marginLeft: 10 }}
        />
        <View>
          <Text style={{ marginTop: 5, fontWeight: "bold" }}>Balconista</Text>
          <Text style={{ marginTop: 2 }}>Online</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={{
            paddingHorizontal: 5,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 10,
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              marginRight: 8,
              borderWidth: 1,
              padding: 8,
              backgroundColor: "white",
              borderRadius: 40,
            }}
            placeholder="Como esta se sentindo?"
            value={inputText}
            onChangeText={setInputText}
          />
          <Button title="Enviar" onPress={sendMessage} color={"#2F4F4F"} />
        </View>
      </View>
    </ImageBackground>
  );
};

export default ChatScreen;
