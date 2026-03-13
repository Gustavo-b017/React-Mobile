import { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Image, ActivityIndicator } from "react-native";
import { api } from "@/server/api";
import { isAxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

// Tipagem rigorosa para a resposta de erro da API
interface ApiErrorResponse {
  message: string;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados de erro separados para feedback visual (Exigência do PDF de Validação)
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    async function verificarSessao() {
      try {
        const usuarioSalvo = await AsyncStorage.getItem("@interclasse_user");
        if (usuarioSalvo) {
          router.replace("/modalidades");
        }
      } catch (e) {
        console.error("Erro ao ler sessão do AsyncStorage", e);
      }
    }
    verificarSessao();
  }, []);

  // Lógica Sênior: Validação em tempo real (Feedback imediato)
  function handleEmailChange(texto: string) {
    setEmail(texto);
    if (texto.trim() === "") {
      setEmailError("O campo não pode ficar vazio.");
    } else if (!texto.includes("@") && !texto.toLowerCase().startsWith("rm")) {
      setEmailError("Insira um RM ou E-mail válido.");
    } else {
      setEmailError(null); // Limpa o erro se estiver correto
    }
  }

  function handlePasswordChange(texto: string) {
    setPassword(texto);
    if (texto.length < 3) {
      setPasswordError("A senha deve ter no mínimo 3 caracteres.");
    } else {
      setPasswordError(null);
    }
  }

  async function handleEntrar() {
    // Revalidação forçada antes do envio
    if (!email || emailError || !password || passwordError) {
      Alert.alert("Atenção", "Corrija os erros destacados antes de entrar.");
      return;
    }

    setCarregando(true);

    try {
      const response = await api.post("/login", { email, password });
      
      // Salva a sessão no AsyncStorage após sucesso
      await AsyncStorage.setItem("@interclasse_user", email);
      router.replace("/modalidades");
      
    } catch (error) {
      // Tratamento de erro robusto com Axios
      if (isAxiosError<ApiErrorResponse>(error)) {
        Alert.alert(
          "Acesso Negado",
          error.response?.data?.message || "Servidor indisponível no momento."
        );
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado. Verifique sua conexão.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: "https://via.placeholder.com/150" }} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Interclasse Digital</Text>
      
      {/* Campo de E-mail com Feedback Visual */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="E-mail ou RM"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={handleEmailChange}
          value={email}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      {/* Campo de Senha com Feedback Visual */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Senha"
          secureTextEntry
          onChangeText={handlePasswordChange}
          value={password}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          // Desabilita visualmente o botão se houver erros ou campos vazios
          (carregando || emailError !== null || passwordError !== null || !email || !password) && { opacity: 0.5 },
          pressed && { opacity: 0.8 }
        ]}
        disabled={carregando || emailError !== null || passwordError !== null || !email || !password}
        onPress={handleEntrar}
      >
        {carregando ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.text}>Entrar</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, gap: 12, backgroundColor: "#F5F5F5" },
  logo: { width: 120, height: 120, marginBottom: 10, borderRadius: 60 },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 20 },
  inputContainer: { width: "100%", marginBottom: 8 },
  input: { height: 54, width: "100%", backgroundColor: "#FFF", borderRadius: 8, padding: 16, fontSize: 16, borderWidth: 1, borderColor: "#CCC" },
  inputError: { borderColor: "#e20a27", borderWidth: 2 }, // Destaca o erro em vermelho
  errorText: { color: "#e20a27", fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: "500" },
  button: { height: 54, width: "100%", backgroundColor: "#0a27e2", borderRadius: 8, justifyContent: "center", alignItems: "center", marginTop: 10 },
  text: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});