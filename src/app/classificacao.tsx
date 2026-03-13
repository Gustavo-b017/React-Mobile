import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { api } from "@/server/api";
import { isAxiosError } from "axios";

export interface Turma {
  id: string;
  nome: string;
  pontos: number;
}

export default function Classificacao() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function buscarClassificacao(isPullToRefresh = false) {
    if (isPullToRefresh) {
      setAtualizando(true);
    }

    try {
      // Tipagem na chamada da API
      const response = await api.get<Turma[]>("/classificacao");
      
      // Lógica de ordenação: garante que quem tem mais pontos fique no topo
      const turmasOrdenadas = response.data.sort((a, b) => b.pontos - a.pontos);
      setTurmas(turmasOrdenadas);

    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert("Erro", error.response?.data?.message || "Não foi possível carregar o ranking.");
      } else {
        Alert.alert("Erro", "Ocorreu um erro inesperado.");
      }
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    buscarClassificacao();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabela de Classificação</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#0a27e2" style={styles.loader} />
      ) : (
        <FlatList
          data={turmas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={atualizando} 
              onRefresh={() => buscarClassificacao(true)} 
              colors={["#0a27e2"]} 
            />
          }
          renderItem={({ item, index }) => (
            <View style={styles.card}>
              <View style={styles.posicaoContainer}>
                <Text style={styles.posicao}>{index + 1}º</Text>
              </View>
              <Text style={styles.nomeTurma}>{item.nome}</Text>
              <Text style={styles.pontos}>{item.pontos} pts</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.aviso}>Nenhuma pontuação registada.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5F5F5" },
  titulo: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  loader: { marginTop: 50 },
  card: { flexDirection: "row", backgroundColor: "#FFF", padding: 16, marginBottom: 10, borderRadius: 8, alignItems: "center", justifyContent: "space-between", elevation: 2 },
  posicaoContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E6E9FA", justifyContent: "center", alignItems: "center", marginRight: 12 },
  posicao: { fontSize: 18, fontWeight: "bold", color: "#0a27e2" },
  nomeTurma: { fontSize: 18, fontWeight: "600", flex: 1, color: "#444" },
  pontos: { fontSize: 18, fontWeight: "bold", color: "#333" },
  aviso: { textAlign: "center", marginTop: 20, color: "#666", fontSize: 16 },
});