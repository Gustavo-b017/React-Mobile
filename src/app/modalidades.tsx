import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// 1. Tipagem Sênior: Extrai os nomes exatos permitidos pela biblioteca de ícones
type NomeIcone = keyof typeof MaterialIcons.glyphMap;

interface Modalidade {
  id: string;
  nome: string;
  tipo: string;
  icone: NomeIcone; // Agora o TS sabe exatamente que ícones existem
}

// 2. Dados perfeitamente tipados (sem avisos ou erros)
const MODALIDADES_OFICIAIS: Modalidade[] = [
  { id: "1", nome: "Futsal", tipo: "Equipa", icone: "sports-soccer" },
  { id: "2", nome: "Vôlei", tipo: "Equipa", icone: "sports-volleyball" },
  { id: "3", nome: "Basquete", tipo: "Equipa", icone: "sports-basketball" },
  { id: "4", nome: "E-sports", tipo: "Equipa", icone: "sports-esports" },
];

export default function Modalidades() {
  function irParaInscricao(nomeModalidade: string) {
    router.push({
      pathname: "/inscricao",
      params: { modalidadeSelecionada: nomeModalidade }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Modalidades do Interclasse</Text>
      <Text style={styles.subtitulo}>Selecione um desporto para competir</Text>

      <FlatList
        data={MODALIDADES_OFICIAIS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable 
            style={({ pressed }) => [
              styles.card, 
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] } // Feedback tátil fluído
            ]}
            onPress={() => irParaInscricao(item.nome)}
          >
            <View style={styles.infoContainer}>
              <View style={styles.iconeContainer}>
                {/* 3. Fim do @ts-ignore! O código agora é 100% seguro. */}
                <MaterialIcons name={item.icone} size={36} color="#0a27e2" />
              </View>
              <View style={styles.textos}>
                <Text style={styles.nomeModalidade}>{item.nome}</Text>
                <Text style={styles.tipoBadge}>{item.tipo}</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#CCC" />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#F5F5F5" },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center", color: "#333" },
  subtitulo: { fontSize: 16, textAlign: "center", color: "#666", marginBottom: 24 },
  card: { flexDirection: "row", backgroundColor: "#FFF", padding: 16, marginBottom: 16, borderRadius: 12, alignItems: "center", justifyContent: "space-between", elevation: 2 },
  infoContainer: { flexDirection: "row", alignItems: "center", gap: 16 },
  iconeContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#E6E9FA", justifyContent: "center", alignItems: "center" },
  textos: { justifyContent: "center" },
  nomeModalidade: { fontSize: 20, fontWeight: "bold", color: "#333" },
  tipoBadge: { fontSize: 14, color: "#666", marginTop: 4 },
});