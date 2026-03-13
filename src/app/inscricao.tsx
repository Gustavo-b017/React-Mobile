import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import { api } from "@/server/api";
import { isAxiosError } from "axios";
import { useLocalSearchParams, router } from "expo-router";

// Tipagem forte para a resposta da API (Prática acadêmica essencial)
interface InscricaoResponse {
  message: string;
}

export default function Inscricao() {
  const { modalidadeSelecionada } = useLocalSearchParams(); 

  const [matricula, setMatricula] = useState("");
  const [matriculaError, setMatriculaError] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const modalidade = typeof modalidadeSelecionada === 'string' ? modalidadeSelecionada : "Esporte não selecionado";

  // Validação em tempo real e formatação
  function handleMatriculaChange(texto: string) {
    // Regex Sênior: Remove tudo que não for número instantaneamente
    const apenasNumeros = texto.replace(/[^0-9]/g, '');
    setMatricula(apenasNumeros);

    if (apenasNumeros.length < 5) {
      setMatriculaError("O RM deve ter pelo menos 5 dígitos.");
    } else {
      setMatriculaError(null);
    }
  }

  async function handleEnviarInscricao() {
    // Bloqueia o envio se houver erro não corrigido
    if (!matricula || matriculaError) {
      Alert.alert("Atenção", "Preencha o seu RM corretamente antes de confirmar.");
      return; 
    }

    setCarregando(true);

    try {
      // Endpoint POST 2 exigido no CP
      const response = await api.post<InscricaoResponse>("/inscricao", { 
        matricula, 
        modalidade 
      });
      
      Alert.alert("Sucesso!", response.data.message, [
        { text: "OK", onPress: () => router.back() } 
      ]);
      
    } catch (error) {
      if (isAxiosError<InscricaoResponse>(error)) {
        Alert.alert("Falha na Inscrição", error.response?.data?.message || "Erro de conexão com a API.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Confirmação de Inscrição</Text>
      
      <View style={styles.cardResumo}>
        <Text style={styles.labelResumo}>Modalidade Escolhida:</Text>
        <Text style={styles.destaqueModalidade}>{modalidade}</Text>
      </View>

      <Text style={styles.label}>Confirme o seu RM para validar:</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, matriculaError ? styles.inputError : null]}
          placeholder="Digite apenas números (Ex: 12345)"
          keyboardType="numeric"
          value={matricula}
          onChangeText={handleMatriculaChange}
          maxLength={10} // Prevenção contra abusos
        />
        {matriculaError && <Text style={styles.errorText}>{matriculaError}</Text>}
      </View>

      <Pressable 
        style={({ pressed }) => [
          styles.botao,
          (carregando || !matricula || matriculaError !== null) && { opacity: 0.5 },
          pressed && { opacity: 0.8 }
        ]}
        onPress={handleEnviarInscricao}
        disabled={carregando || !matricula || matriculaError !== null}
      >
        {carregando ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.textoBotao}>Confirmar Participação</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5F5F5", justifyContent: "center" },
  titulo: { fontSize: 24, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 30 },
  cardResumo: { backgroundColor: "#E6E9FA", padding: 20, borderRadius: 12, marginBottom: 30, alignItems: "center", borderWidth: 1, borderColor: "#0a27e2" },
  labelResumo: { fontSize: 16, color: "#555", marginBottom: 8 },
  destaqueModalidade: { fontSize: 22, fontWeight: "bold", color: "#0a27e2" },
  label: { fontSize: 16, fontWeight: "600", color: "#444", marginBottom: 10 },
  inputContainer: { width: "100%", marginBottom: 20 },
  input: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#DDD", borderRadius: 8, padding: 16, fontSize: 18 },
  inputError: { borderColor: "#e20a27", borderWidth: 2 },
  errorText: { color: "#e20a27", fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: "500" },
  botao: { backgroundColor: "#0a27e2", padding: 18, borderRadius: 8, alignItems: "center", marginTop: 10 },
  textoBotao: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});