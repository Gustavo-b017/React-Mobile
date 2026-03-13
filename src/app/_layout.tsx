import { Tabs, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AppLayout() {
  
  // Função Sênior: Lida com a destruição da sessão
  async function handleLogout() {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive",
        onPress: async () => {
          try {
            // Remove o cache de sessão (Exigência de Segurança)
            await AsyncStorage.removeItem("@interclasse_user");
            // Limpa o cache de jogos para o próximo usuário não ver dados velhos
            await AsyncStorage.removeItem("@interclasse_jogos"); 
            router.replace("/");
          } catch (error) {
            console.error("Erro ao fazer logout", error);
          }
        }
      }
    ]);
  }

  // Componente reutilizável para o botão de sair no cabeçalho
  const BotaoSair = () => (
    <Pressable onPress={handleLogout} style={{ marginRight: 16, padding: 4 }}>
      <MaterialIcons name="logout" size={24} color="#FFF" />
    </Pressable>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0a27e2",
        tabBarInactiveTintColor: "#888",
        headerStyle: { backgroundColor: "#0a27e2" },
        headerTintColor: "#FFF",
        headerTitleAlign: "center",
        // Adiciona o botão de logout em todas as telas das abas
        headerRight: () => <BotaoSair /> 
      }}
    >
      {/* 1. LOGIN - Totalmente Oculto */}
      <Tabs.Screen
        name="index"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />

      {/* 2. MENU: MODALIDADES */}
      <Tabs.Screen
        name="modalidades"
        options={{
          title: "Modalidades",
          tabBarIcon: ({ color }) => <MaterialIcons name="sports-soccer" size={24} color={color} />,
        }}
      />

      {/* 3. MENU: CALENDÁRIO */}
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} />,
        }}
      />

      {/* 4. MENU: CLASSIFICAÇÃO (RANKING) */}
      <Tabs.Screen
        name="classificacao"
        options={{
          title: "Ranking",
          tabBarIcon: ({ color }) => <MaterialIcons name="emoji-events" size={24} color={color} />,
        }}
      />

      {/* 5. MENU: EDUCAÇÃO FÍSICA */}
      <Tabs.Screen
        name="educacao-fisica"
        options={{
          title: "Atividades",
          tabBarIcon: ({ color }) => <MaterialIcons name="fitness-center" size={24} color={color} />,
        }}
      />

      {/* 6. TELA INTERNA: INSCRIÇÃO */}
      <Tabs.Screen
        name="inscricao"
        options={{
          href: null, 
          title: "Nova Inscrição",
          // Na tela interna, podemos tirar o botão de sair para focar no formulário (opcional)
          headerRight: () => null 
        }}
      />
    </Tabs>
  );
}