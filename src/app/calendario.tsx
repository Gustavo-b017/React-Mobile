import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Alert, ActivityIndicator, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/server/api";
import { isAxiosError } from "axios";

// Tipagem rigorosa
export interface Jogo {
  id: string;
  modalidade: string;
  equipas: string;
  data: string;
  local: string;
}

const STORAGE_KEY = "@interclasse_jogos";

export default function Calendario() {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false); // Estado para o Pull-to-Refresh

  async function carregarCalendario(isPullToRefresh = false) {
    if (isPullToRefresh) {
      setAtualizando(true);
    } else {
      setCarregando(true);
    }

    try {
      // 1. OFFLINE-FIRST: Tenta carregar do cache para resposta imediata na UI
      const dadosLocais = await AsyncStorage.getItem(STORAGE_KEY);
      if (dadosLocais) {
        try {
          // Proteção contra JSON corrompido
          setJogos(JSON.parse(dadosLocais));
        } catch (parseError) {
          console.error("Cache corrompido, ignorando...", parseError);
        }
      }

      // 2. STALE-WHILE-REVALIDATE: Vai na API em background buscar os dados mais frescos
      const response = await api.get<Jogo[]>("/calendario");
      
      // 3. Atualiza a tela e salva o novo cache
      setJogos(response.data);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));

    } catch (error) {
      if (isAxiosError(error)) {
        // Se falhar e a lista estiver vazia, avisa. Se já tiver dados do cache, falha silenciosamente.
        if (jogos.length === 0) {
          Alert.alert("Erro de Conexão", "Não foi possível buscar o calendário e não há dados salvos.");
        }
      }
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregarCalendario();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calendário de Jogos</Text>

      {carregando && jogos.length === 0 ? (
        <ActivityIndicator size="large" color="#0a27e2" style={styles.loader} />
      ) : (
        <FlatList
          data={jogos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          // A MÁGICA: Adicionando o Pull-to-Refresh nativo
          refreshControl={
            <RefreshControl 
              refreshing={atualizando} 
              onRefresh={() => carregarCalendario(true)} 
              colors={["#0a27e2"]} 
            />
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.headerCard}>
                <Text style={styles.modalidade}>{item.modalidade}</Text>
                <Text style={styles.data}>{item.data}</Text>
              </View>
              <Text style={styles.equipas}>{item.equipas}</Text>
              <Text style={styles.local}>📍 {item.local}</Text>
            </View>
          )}
          ListEmptyComponent={
            !carregando ? <Text style={styles.aviso}>Nenhum jogo agendado.</Text> : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#333" },
  loader: { marginTop: 50 },
  card: { backgroundColor: "#FFF", padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 5, borderLeftColor: "#0a27e2", elevation: 3 },
  headerCard: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  modalidade: { fontWeight: "bold", fontSize: 16, color: "#0a27e2" },
  data: { fontSize: 14, fontWeight: "600", color: "#e20a27" },
  equipas: { fontSize: 18, marginBottom: 8, color: "#333" },
  local: { fontSize: 14, color: "#666" },
  aviso: { textAlign: "center", color: "#666", marginTop: 20, fontSize: 16 },
});