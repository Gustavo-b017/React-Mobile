import { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export interface Inscrito { id: string; nome: string; pontos: number; }

export default function Classificacao() {
  const [lista, setLista] = useState<Inscrito[]>([]);
  const [meuRM, setMeuRM] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function carregarDadosDoAsyncStorage(isPullToRefresh = false) {
    if (isPullToRefresh) setAtualizando(true);

    try {
      // 1. Sabe quem é o utilizador logado para pintar a linha de azul
      const perfilLocal = await AsyncStorage.getItem("@interclasse_perfil");
      if (perfilLocal) {
        setMeuRM(JSON.parse(perfilLocal).rm);
      }

      // 2. Lê a "Base de Dados" local inteira
      const listaSalva = await AsyncStorage.getItem("@interclasse_lista_inscricoes");
      
      if (listaSalva) {
        const arrayCompleto = JSON.parse(listaSalva);
        
        // 3. Lógica do Sênior: Limita a APENAS OS 10 PRIMEIROS (Ordem de chegada)
        const top10 = arrayCompleto.slice(0, 10);
        setLista(top10);
      } else {
        setLista([]); // Se não houver nada, lista vazia
      }

    } catch (error) {
      console.error("Erro ao carregar ranking do AsyncStorage:", error);
      Alert.alert("Erro", "Falha ao ler os dados do telemóvel.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  // O useFocusEffect garante que a tela atualiza mal tu pises nela
  useFocusEffect(
    useCallback(() => {
      carregarDadosDoAsyncStorage();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Últimos 10 Inscritos</Text>
      <Text style={styles.subtitulo}>(Armazenamento Local - AsyncStorage)</Text>

      {carregando ? (
        <ActivityIndicator size="large" color="#0a27e2" style={styles.loader} />
      ) : (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={ <RefreshControl refreshing={atualizando} onRefresh={() => carregarDadosDoAsyncStorage(true)} colors={["#0a27e2"]} /> }
          renderItem={({ item, index }) => {
            
            // Destaque visual se o item da lista for o utilizador atual
            const isMinhaEquipa = meuRM === item.id;

            return (
              <View style={[styles.card, isMinhaEquipa && styles.cardDestaque]}>
                <View style={[styles.posicaoContainer, isMinhaEquipa && styles.posicaoContainerDestaque]}>
                  <Text style={[styles.posicao, isMinhaEquipa && styles.posicaoDestaque]}>{index + 1}º</Text>
                </View>
                <Text style={[styles.nomeTurma, isMinhaEquipa && styles.textoDestaque]}>
                  {item.nome}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={<Text style={styles.avisoVazio}>Ainda não há inscritos salvos no telemóvel.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5F5F5" },
  titulo: { fontSize: 20, fontWeight: "bold", color: "#333", textAlign: "center" },
  subtitulo: { fontSize: 12, color: "#888", textAlign: "center", marginBottom: 16 },
  loader: { marginTop: 50 },
  card: { flexDirection: "row", backgroundColor: "#FFF", padding: 16, marginBottom: 10, borderRadius: 8, alignItems: "center", justifyContent: "space-between", elevation: 2, borderWidth: 1, borderColor: "transparent" },
  posicaoContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#E6E9FA", justifyContent: "center", alignItems: "center", marginRight: 12 },
  posicao: { fontSize: 18, fontWeight: "bold", color: "#0a27e2" },
  nomeTurma: { fontSize: 16, fontWeight: "600", flex: 1, color: "#444" },
  cardDestaque: { borderColor: "#0a27e2", borderWidth: 2, backgroundColor: "#F0F4FF" },
  posicaoContainerDestaque: { backgroundColor: "#0a27e2" },
  posicaoDestaque: { color: "#FFF" },
  textoDestaque: { color: "#0a27e2", fontWeight: "bold" },
  avisoVazio: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#666" }
});