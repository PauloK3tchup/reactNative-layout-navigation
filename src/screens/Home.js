import * as React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";

import { userState } from "../recoil/atoms/auth";

import MoviesApi from "../api/movies";
const moviesApi = new MoviesApi();

export default function HomeScreen() {
  const setUser = useSetRecoilState(userState);
  const currentUserState = useRecoilValue(userState);
  const [movies, setMovies] = React.useState([]);

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      const data = await moviesApi.getMovies();
      setMovies(data);
    };

    bootstrapAsync();
  }, []);

  const logout = async () => {
    setUser({ loggedIn: false, access_token: null, refresh_token: null });
    await SecureStore.deleteItemAsync("access_token");
  };

  return (
    <ScrollView>
      <Text style={{ margin: 10 }}>Bem-Vindo meu nobre</Text>
      <Text style={{ margin: 10 }}>
        Access Token: {currentUserState.access_token}
      </Text>
      {movies.map((movie) => (
        <View style={styles.container} key={movie.id}>
          <Text style={styles.textoCor}>
            {movie.title} - {movie.year}
          </Text>
          <Text style={styles.textoGen}>Gênero: {movie.genre}</Text>
          <Image
            style={{
              width: 200,
              height: 300,
              margin: 10,
              resizeMode: "stretch",
            }}
            source={{ uri: movie.poster }}
          />
        </View>
      ))}
      <TouchableOpacity style={styles.Botom} onPress={() => logout()}>
        <Text style={styles.textoCor}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },

  textoCor: {
    fontSize: 20,
    color: "#fff",
    margin: 10,
  },
  textoGen: {
    fontSize: 18,
    color: "gray",
    margin: 10,
  },

  Botom: {
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
});
