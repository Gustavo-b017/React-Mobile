import { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Pressable, 
  Alert, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from "react-native";
import { api } from "@/server/api";
import { useLocalSearchParams, router, Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Integrante {
  nome: string;
  rm: string;
}

export default function Inscricao() {
  const { modalidadeSelecionada } = useLocalSearchParams(); 
  const modalidade = typeof modalidadeSelecionada === 'string' ? modalidadeSelecionada : "Esporte";

  const [nomeMembro, setNomeMembro] = useState("");
  const [rmMembro, setRmMembro] = useState("");
  const [listaIntegrantes, setListaIntegrantes] = useState<Integrante[]>([]);
  const [carregando, setCarregando] = useState(false);

  const obterMinimoIntegrantes = () => {
    const mod = modalidade.toLowerCase();
    if (mod.includes("futsal") || mod.includes("basquete")) return 10;
    if (mod.includes("vôlei") || mod.includes("volei")) return 12;
    return 0;
  };

  const minIntegrantes = obterMinimoIntegrantes();

  function handleAdicionarMembro() {
    if (nomeMembro.trim().length < 3 || rmMembro.length < 5) {
      Alert.alert("Erro", "Preencha o nome e o RM (mínimo 5 dígitos) corretamente.");
      return;
    }
    setListaIntegrantes([...listaIntegrantes, { nome: nomeMembro, rm: rmMembro }]);
    setNomeMembro("");
    setRmMembro("");
  }

  function removerMembro(index: number) {
    const novaLista = [...listaIntegrantes];
    novaLista.splice(index, 1);
    setListaIntegrantes(novaLista);
  }

  async function handleConfirmarInscricao() {
    if (listaIntegrantes.length < minIntegrantes) {
      Alert.alert("Time Incompleto", `Para ${modalidade}, são necessários no mínimo ${minIntegrantes} atletas.`);
      return;
    }

    setCarregando(true);
    try {
      /**
       * AJUSTE DE INTEGRAÇÃO:
       * O seu Backend espera 'matricula' e 'modalidade'. 
       * Estamos enviando o RM do primeiro integrante como matrícula líder.
       */
      await api.post("/api/inscricao", { 
        modalidade: modalidade, 
        matricula: listaIntegrantes[0].rm, 
        integrantes: listaIntegrantes 
      });
      
      // Lógica de Persistência Local (Offline First)
      const listaSalva = await AsyncStorage.getItem("@interclasse_lista_inscricoes");
      let ranking = listaSalva ? JSON.parse(listaSalva) : [];
      
      ranking.push({
        id: `time-${listaIntegrantes[0].rm}-${Date.now()}`,
        nome: `Time ${modalidade} (Líder: ${listaIntegrantes[0].nome})`,
        pontos: 100 
      });

      await AsyncStorage.setItem("@interclasse_lista_inscricoes", JSON.stringify(ranking));

      Alert.alert("Sucesso!", "Inscrição realizada e salva no ranking!", [
        { text: "Ver Modalidades", onPress: () => router.replace("/modalidades") }
      ]);
    } catch (error) {
      Alert.alert("Erro na API", "O servidor recusou a inscrição ou está offline.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <Stack.Screen 
        options={{ 
          title: "Inscrição", 
          headerStyle: { backgroundColor: "#0a27e2" }, 
          headerTintColor: "#FFF" 
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCorpo}>
          <Text style={styles.overtitle}>ETAPA DE CADASTRO</Text>
          <Text style={styles.titulo}>{modalidade.toUpperCase()}</Text>
          <View style={styles.divisor} />
        </View>

        <LinearGradient colors={['#1a1a1a', '#0a1661']} style={styles.cardInfo}>
          <MaterialIcons name="info-outline" size={20} color="#0a27e2" />
          <Text style={styles.textoInfo}>
            {minIntegrantes > 0 
              ? `Necessário mínimo de ${minIntegrantes} integrantes para validar o time.`
              : "Esta modalidade permite inscrição individual ou em grupo."}
          </Text>
        </LinearGradient>

        <View style={styles.formAdicionar}>
          <Text style={styles.labelSecao}>ADICIONAR ATLETA</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            placeholderTextColor="#666"
            value={nomeMembro}
            onChangeText={setNomeMembro}
          />
          <TextInput
            style={[styles.input, { marginTop: 12 }]}
            placeholder="RM do Aluno"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={rmMembro}
            onChangeText={(t) => setRmMembro(t.replace(/[^0-9]/g, ""))}
            maxLength={10}
          />
          <Pressable style={styles.botaoAdicionar} onPress={handleAdicionarMembro}>
            <MaterialIcons name="person-add" size={20} color="#FFF" />
            <Text style={styles.textoBotaoAdicionar}>Adicionar na Lista</Text>
          </Pressable>
        </View>

        <View style={styles.secaoLista}>
          <View style={styles.listaHeader}>
            <Text style={styles.labelSecao}>ATLETAS INSCRITOS</Text>
            <View style={styles.badgeContagem}>
              <Text style={styles.textoBadge}>{listaIntegrantes.length}</Text>
            </View>
          </View>
          
          {listaIntegrantes.map((item, index) => (
            <View key={index} style={styles.itemMembro}>
              <View>
                <Text style={styles.textoMembroNome}>{item.nome}</Text>
                <Text style={styles.textoMembroRM}>RM {item.rm}</Text>
              </View>
              <Pressable onPress={() => removerMembro(index)} style={styles.botaoRemover}>
                <MaterialIcons name="delete-outline" size={22} color="#ff4444" />
              </Pressable>
            </View>
          ))}

          {listaIntegrantes.length === 0 && (
            <Text style={styles.listaVazia}>Nenhum integrante na lista ainda.</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Pressable 
            style={[
              styles.botaoConfirmar, 
              (carregando || (minIntegrantes > 0 && listaIntegrantes.length < minIntegrantes)) && styles.botaoDesabilitado
            ]}
            onPress={handleConfirmarInscricao}
            disabled={carregando || (minIntegrantes > 0 && listaIntegrantes.length < minIntegrantes)}
          >
            {carregando ? <ActivityIndicator color="#FFF" /> : (
              <>
                <Text style={styles.textoBotaoConfirmar}>FINALIZAR TIME</Text>
                <MaterialIcons name="check-circle" size={20} color="#FFF" />
              </>
            )}
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.botaoCancelar}>
            <Text style={styles.textoBotaoCancelar}>Cancelar e voltar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  scrollContainer: { paddingHorizontal: 24, paddingBottom: 40 },
  headerCorpo: { paddingTop: 30, marginBottom: 20 },
  overtitle: { color: "#0a27e2", fontWeight: "800", fontSize: 12, letterSpacing: 2 },
  titulo: { fontSize: 32, fontWeight: "900", color: "#FFF", marginTop: 5 },
  divisor: { width: 50, height: 4, backgroundColor: "#0a27e2", marginTop: 10, borderRadius: 2 },
  cardInfo: { flexDirection: "row", padding: 16, borderRadius: 12, alignItems: "center", gap: 12, borderWidth: 1, borderColor: "rgba(10, 39, 226, 0.3)", marginBottom: 24 },
  textoInfo: { color: "#BBB", fontSize: 13, flex: 1, lineHeight: 18 },
  formAdicionar: { backgroundColor: "#1a1a1a", padding: 20, borderRadius: 16, marginBottom: 24 },
  labelSecao: { color: "#FFF", fontSize: 14, fontWeight: "800", marginBottom: 16, letterSpacing: 1 },
  input: { backgroundColor: "#222", color: "#FFF", padding: 16, borderRadius: 10, fontSize: 16, borderWidth: 1, borderColor: "#333" },
  botaoAdicionar: { backgroundColor: "#27ae60", flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 14, borderRadius: 10, marginTop: 16, gap: 8 },
  textoBotaoAdicionar: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
  secaoLista: { marginBottom: 30 },
  listaHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  badgeContagem: { backgroundColor: "#0a27e2", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  textoBadge: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  itemMembro: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1a1a1a", padding: 16, borderRadius: 10, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: "#0a27e2" },
  textoMembroNome: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  textoMembroRM: { color: "#666", fontSize: 13, marginTop: 2 },
  botaoRemover: { padding: 4 },
  listaVazia: { textAlign: "center", color: "#444", marginTop: 20, fontStyle: "italic" },
  footer: { marginTop: 10 },
  botaoConfirmar: { backgroundColor: "#0a27e2", padding: 20, borderRadius: 14, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 10 },
  botaoDesabilitado: { opacity: 0.5, backgroundColor: "#333" },
  textoBotaoConfirmar: { color: "#FFF", fontWeight: "900", fontSize: 16 },
  botaoCancelar: { padding: 20, alignItems: "center" },
  textoBotaoCancelar: { color: "#666", fontSize: 14, fontWeight: "600" }
});