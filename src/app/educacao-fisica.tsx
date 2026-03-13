import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ATIVIDADES = [
  { id: "1", nome: "Corrida de Saco" },
  { id: "2", nome: "Dança das Cadeiras" },
  { id: "3", nome: "Pula Corda" },
  { id: "4", nome: "Cabo de Guerra" },
  { id: "5", nome: "Mímica" },
];

const PARTICIPANTES = [
  { id: "p1", nome: "Ana Silva" }, { id: "p2", nome: "Carlos Oliveira" },
  { id: "p3", nome: "Mariana Santos" }, { id: "p4", nome: "João Pedro" },
  { id: "p5", nome: "Beatriz Costa" }, { id: "p6", nome: "Lucas Almeida" },
  { id: "p7", nome: "Fernanda Lima" }, { id: "p8", nome: "Rafael Souza" },
  { id: "p9", nome: "Camila Alves" }, { id: "p10", nome: "Mateus Silva" },
  { id: "p11", nome: "Juliana (NÃO DEVE APARECER)" },
];

function useSelecaoMultipla() {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  const alternarSelecao = (id: string) => {
    setSelecionadas((estadoAtual) => 
      estadoAtual.includes(id)
        ? estadoAtual.filter((itemId) => itemId !== id)
        : [...estadoAtual, id]
    );
  };

  const verificarSeEstaAtivo = (id: string) => selecionadas.includes(id);

  return { selecionadas, alternarSelecao, verificarSeEstaAtivo };
}

export default function EducacaoFisica() {
  const { alternarSelecao, verificarSeEstaAtivo } = useSelecaoMultipla();
  const [listaParticipantes, setListaParticipantes] = useState(PARTICIPANTES.slice(0, 10));

  useEffect(() => {
    async function carregarMeuPerfil() {
      try {
        const perfilLocal = await AsyncStorage.getItem("@interclasse_perfil");
        if (perfilLocal) {
          const perfil = JSON.parse(perfilLocal);
          setListaParticipantes([
            { id: "eu", nome: `${perfil.nome} (Você)` },
            ...PARTICIPANTES.slice(0, 9)
          ]);
        }
      } catch (error) {
        console.error("Erro ao carregar perfil nas atividades", error);
      }
    }
    carregarMeuPerfil();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Atividades Físicas</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selecione as Dinâmicas</Text>
        <View style={styles.tagsContainer}>
          {ATIVIDADES.map((ativ) => {
            const isAtivo = verificarSeEstaAtivo(ativ.id);
            return (
              <Pressable
                key={ativ.id}
                style={[styles.tag, isAtivo && styles.tagAtiva]}
                onPress={() => alternarSelecao(ativ.id)}
              >
                <Text style={[styles.tagTexto, isAtivo && styles.tagTextoAtiva]}>
                  {ativ.nome}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.sectionLista}>
        <Text style={styles.sectionTitle}>Inscritos (Top 10)</Text>
        <FlatList
          data={listaParticipantes}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.cardParticipante, item.id === "eu" && { borderColor: "#0a27e2", borderWidth: 2 }]}>
              <View style={[styles.avatar, item.id === "eu" && { backgroundColor: "#0a27e2" }]}>
                <MaterialIcons name="person" size={24} color={item.id === "eu" ? "#FFF" : "#0a27e2"} />
              </View>
              <Text style={[styles.nomeParticipante, item.id === "eu" && { fontWeight: "bold" }]}>{item.nome}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", paddingTop: 20 },
  headerTitle: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionLista: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#444", marginBottom: 12 },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tag: { backgroundColor: "#FFF", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: "#DDD", elevation: 1 },
  tagAtiva: { backgroundColor: "#0a27e2", borderColor: "#0a27e2" },
  tagTexto: { color: "#555", fontWeight: "600", fontSize: 14 },
  tagTextoAtiva: { color: "#FFF" },
  cardParticipante: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFF", padding: 16, marginBottom: 10, borderRadius: 8, elevation: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E6E9FA", justifyContent: "center", alignItems: "center", marginRight: 15 },
  nomeParticipante: { fontSize: 16, fontWeight: "500", color: "#333" },
});