import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/server/api";

export interface Turma { id: string; nome: string; pontos: number; }

export default function Classificacao() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [meuPerfil, setMeuPerfil] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function carregarDados(isPullToRefresh = false) {
    if (isPullToRefresh) setAtualizando(true);

    try {
      const perfilLocal = await AsyncStorage.getItem("@interclasse_perfil");
      if (perfilLocal) {
        setMeuPerfil(JSON.parse(perfilLocal));
      }

      const response = await api.get<Turma[]>("/classificacao");
      setTurmas(response.data.sort((a, b) => b.pontos - a.pontos));
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os dados.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => { carregarDados(); }, []);

  return (
    <View style={styles.container}>
      {meuPerfil && (
        <View style={styles.meuPerfilCard}>
          <Text style={styles.perfilTitulo}>Olá, {meuPerfil.nome}</Text>
          <Text style={styles.perfilSub}>RM: {meuPerfil.rm}</Text>
          <Text style={styles.perfilDestaque}>Desporto: {meuPerfil.modalidade}</Text>
        </View>
      )}

      <Text style={styles.titulo}>Tabela de Classificação Geral</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#0a27e2" style={styles.loader} />
      ) : (
        <FlatList
          data={turmas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={ <RefreshControl refreshing={atualizando} onRefresh={() => carregarDados(true)} colors={["#0a27e2"]} /> }
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.posicaoContainer}><Text style={styles.posicao}>{index + 1}º</Text></View>
              <Text style={styles.nomeTurma}>{item.nome}</Text>
              <Text style={styles.pontos}>{item.pontos} pts</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5F5F5" },
  meuPerfilCard: { backgroundColor: "#0a27e2", padding: 16, borderRadius: 12, marginBottom: 24, elevation: 4 },
  perfilTitulo: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  perfilSub: { color: "#E6E9FA", fontSize: 14, marginTop: 4 },
  perfilDestaque: { color: "#FFF", fontSize: 16, fontWeight: "bold", marginTop: 8, backgroundColor: "rgba(255,255,255,0.2)", padding: 6, borderRadius: 6, overflow: "hidden" },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 16, color: "#333" },
  loader: { marginTop: 50 },
  card: { flexDirection: "row", backgroundColor: "#FFF", padding: 16, marginBottom: 10, borderRadius: 8, alignItems: "center", justifyContent: "space-between", elevation: 2 },
  posicaoContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E6E9FA", justifyContent: "center", alignItems: "center", marginRight: 12 },
  posicao: { fontSize: 18, fontWeight: "bold", color: "#0a27e2" },
  nomeTurma: { fontSize: 18, fontWeight: "600", flex: 1, color: "#444" },
  pontos: { fontSize: 18, fontWeight: "bold", color: "#333" },
});