import { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Alert, 
  ActivityIndicator, 
  RefreshControl,
  Platform 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "@/server/api";
import { isAxiosError } from "axios";
import { Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export interface Jogo {
  id: string;
  modalidade: string;
  equipas: string;
  data: string;
  local: string;
}

const STORAGE_KEY = "@interclasse_jogos_v2026";

// CALENDÁRIO COM DATAS REAIS DE MAIO/2026
const MOCK_JOGOS: Jogo[] = [
  // FUTSAL - Rodadas de Segunda e Quarta
  { id: "f1", modalidade: "Futsal", equipas: "Confronto Grupo A", data: "04/05/2026 - 19:00", local: "Ginásio I" },
  { id: "f2", modalidade: "Futsal", equipas: "Confronto Grupo B", data: "04/05/2026 - 20:30", local: "Ginásio I" },
  { id: "f3", modalidade: "Futsal", equipas: "Confronto Grupo C", data: "06/05/2026 - 19:00", local: "Ginásio I" },
  { id: "f4", modalidade: "Futsal", equipas: "Confronto Grupo D", data: "06/05/2026 - 20:30", local: "Ginásio I" },
  { id: "f5", modalidade: "Futsal", equipas: "Oitavas de Final", data: "11/05/2026 - 18:00", local: "Ginásio I" },
  { id: "f6", modalidade: "Futsal", equipas: "Oitavas de Final", data: "11/05/2026 - 19:30", local: "Ginásio I" },
  { id: "f7", modalidade: "Futsal", equipas: "Quartas de Final", data: "13/05/2026 - 20:00", local: "Ginásio I" },
  { id: "f8", modalidade: "Futsal", equipas: "Quartas de Final", data: "18/05/2026 - 19:00", local: "Ginásio II" },
  { id: "f9", modalidade: "Futsal", equipas: "Semifinal", data: "20/05/2026 - 21:00", local: "Arena FIAP" },
  { id: "f10", modalidade: "Futsal", equipas: "Grande Final", data: "22/05/2026 - 20:00", local: "Arena FIAP" },

  // VÔLEI - Rodadas de Terça e Quinta
  { id: "v1", modalidade: "Vôlei", equipas: "Rodada de Abertura", data: "05/05/2026 - 14:00", local: "Quadra B" },
  { id: "v2", modalidade: "Vôlei", equipas: "Rodada de Abertura", data: "05/05/2026 - 15:30", local: "Quadra B" },
  { id: "v3", modalidade: "Vôlei", equipas: "Fase de Grupos", data: "07/05/2026 - 14:00", local: "Quadra B" },
  { id: "v4", modalidade: "Vôlei", equipas: "Fase de Grupos", data: "07/05/2026 - 15:30", local: "Quadra B" },
  { id: "v5", modalidade: "Vôlei", equipas: "Fase Eliminatória", data: "12/05/2026 - 14:00", local: "Quadra B" },
  { id: "v6", modalidade: "Vôlei", equipas: "Fase Eliminatória", data: "12/05/2026 - 15:30", local: "Quadra B" },
  { id: "v7", modalidade: "Vôlei", equipas: "Quartas de Final", data: "14/05/2026 - 16:00", local: "Quadra B" },
  { id: "v8", modalidade: "Vôlei", equipas: "Semifinal", data: "19/05/2026 - 15:00", local: "Quadra B" },
  { id: "v9", modalidade: "Vôlei", equipas: "Disputa 3º Lugar", data: "21/05/2026 - 14:00", local: "Arena FIAP" },
  { id: "v10", modalidade: "Vôlei", equipas: "Final", data: "22/05/2026 - 18:00", local: "Arena FIAP" },

  // BASQUETE - Rodadas de Sexta e Sábado
  { id: "b1", modalidade: "Basquete", equipas: "Classificatórias", data: "08/05/2026 - 10:00", local: "Arena Central" },
  { id: "b2", modalidade: "Basquete", equipas: "Classificatórias", data: "08/05/2026 - 11:30", local: "Arena Central" },
  { id: "b3", modalidade: "Basquete", equipas: "Classificatórias", data: "09/05/2026 - 09:00", local: "Arena Central" },
  { id: "b4", modalidade: "Basquete", equipas: "Classificatórias", data: "09/05/2026 - 10:30", local: "Arena Central" },
  { id: "b5", modalidade: "Basquete", equipas: "Segunda Fase", data: "15/05/2026 - 10:00", local: "Arena Central" },
  { id: "b6", modalidade: "Basquete", equipas: "Segunda Fase", data: "15/05/2026 - 11:30", local: "Arena Central" },
  { id: "b7", modalidade: "Basquete", equipas: "Quartas de Final", data: "16/05/2026 - 10:00", local: "Arena Central" },
  { id: "b8", modalidade: "Basquete", equipas: "Semifinal", data: "16/05/2026 - 15:00", local: "Arena Central" },
  { id: "b9", modalidade: "Basquete", equipas: "Disputa de Bronze", data: "22/05/2026 - 09:00", local: "Arena FIAP" },
  { id: "b10", modalidade: "Basquete", equipas: "Final", data: "22/05/2026 - 11:00", local: "Arena FIAP" },

  // E-SPORTS - Rodadas Noturnas
  { id: "e1", modalidade: "E-sports", equipas: "Qualificatórias Online", data: "04/05/2026 - 22:00", local: "Servidor Discord" },
  { id: "e2", modalidade: "E-sports", equipas: "Qualificatórias Online", data: "05/05/2026 - 22:00", local: "Servidor Discord" },
  { id: "e3", modalidade: "E-sports", equipas: "Fase de Grupos", data: "11/05/2026 - 21:00", local: "Twitch Channel" },
  { id: "e4", modalidade: "E-sports", equipas: "Fase de Grupos", data: "12/05/2026 - 21:00", local: "Twitch Channel" },
  { id: "e5", modalidade: "E-sports", equipas: "Quartas de Final", data: "18/05/2026 - 20:00", local: "Lab 501" },
  { id: "e6", modalidade: "E-sports", equipas: "Quartas de Final", data: "19/05/2026 - 20:00", local: "Lab 501" },
  { id: "e7", modalidade: "E-sports", equipas: "Semifinal 1", data: "20/05/2026 - 19:00", local: "Lounge 1" },
  { id: "e8", modalidade: "E-sports", equipas: "Semifinal 2", data: "21/05/2026 - 19:00", local: "Lounge 1" },
  { id: "e9", modalidade: "E-sports", equipas: "Final Bronze", data: "22/05/2026 - 21:00", local: "Palco Principal" },
  { id: "e10", modalidade: "E-sports", equipas: "Grande Final Live", data: "22/05/2026 - 22:30", local: "Palco Principal" },
];

export default function Calendario() {
  const [jogos, setJogos] = useState<Jogo[]>(MOCK_JOGOS);
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);

  async function carregarCalendario(isPullToRefresh = false) {
    if (isPullToRefresh) setAtualizando(true);
    else setCarregando(true);

    try {
      const dadosLocais = await AsyncStorage.getItem(STORAGE_KEY);
      if (dadosLocais) {
        setJogos(JSON.parse(dadosLocais));
      }

      const response = await api.get<Jogo[]>("/calendario");
      if (response.data && response.data.length > 0) {
        setJogos(response.data);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
      }
    } catch (error) {
      if (isAxiosError(error) && jogos.length === 0) {
        // Se falhar e não houver cache, mantemos o MOCK_JOGOS
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
      <Stack.Screen 
        options={{ 
          title: "Cronograma", 
          headerStyle: { backgroundColor: "#0a27e2" }, 
          headerTintColor: "#FFF",
          headerTitleAlign: "center"
        }} 
      />

      <View style={styles.headerCorpo}>
        <Text style={styles.overtitle}>TEMPORADA OFICIAL</Text>
        <Text style={styles.titulo}>AGENDA DE <Text style={styles.tituloDestaque}>GAMES</Text></Text>
        <View style={styles.divisor} />
      </View>

      <FlatList
        data={jogos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={atualizando} 
            onRefresh={() => carregarCalendario(true)} 
            tintColor="#0a27e2"
            colors={["#0a27e2"]} 
          />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.ladoEsquerdo}>
              <View style={styles.timeIcon}>
                <MaterialIcons name="schedule" size={18} color="#0a27e2" />
              </View>
              <View style={styles.linhaConectora} />
            </View>

            <View style={styles.conteudoCard}>
              <View style={styles.headerCard}>
                <LinearGradient 
                  colors={['#0a27e2', '#061a9c']} 
                  start={{x:0, y:0}} end={{x:1, y:0}} 
                  style={styles.badgeModalidade}
                >
                  <Text style={styles.textoBadge}>
                    {(item.modalidade || "ESPORTE").toUpperCase()}
                  </Text>
                </LinearGradient>
                <Text style={styles.dataTexto}>{item.data}</Text>
              </View>

              <Text style={styles.equipasTexto}>{item.equipas}</Text>
              
              <View style={styles.localContainer}>
                <MaterialIcons name="place" size={14} color="#666" />
                <Text style={styles.localTexto}>{item.local}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  headerCorpo: { paddingHorizontal: 24, paddingTop: 20, marginBottom: 10 },
  overtitle: { color: "#0a27e2", fontWeight: "800", fontSize: 12, letterSpacing: 2 },
  titulo: { fontSize: 32, fontWeight: "900", color: "#FFF", marginTop: 5 },
  tituloDestaque: { color: "#0a27e2" },
  divisor: { width: 50, height: 4, backgroundColor: "#0a27e2", marginTop: 10, borderRadius: 2 },
  lista: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  card: { flexDirection: "row" },
  ladoEsquerdo: { alignItems: "center", width: 40 },
  timeIcon: { 
    width: 32, height: 32, backgroundColor: "#1a1a1a", borderRadius: 16, 
    justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "#333", zIndex: 2
  },
  linhaConectora: { flex: 1, width: 2, backgroundColor: "#1a1a1a", marginVertical: -5 },
  conteudoCard: { 
    flex: 1, backgroundColor: "#1a1a1a", marginLeft: 10, marginBottom: 20, 
    borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.05)"
  },
  headerCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  badgeModalidade: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  textoBadge: { color: "#FFF", fontSize: 10, fontWeight: "900" },
  dataTexto: { color: "#0a27e2", fontSize: 12, fontWeight: "bold" },
  equipasTexto: { color: "#FFF", fontSize: 18, fontWeight: "800", marginBottom: 10 },
  localContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  localTexto: { color: "#666", fontSize: 13, fontWeight: "500" }
});