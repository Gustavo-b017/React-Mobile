# 🏆 Interclasse Digital - FIAP

## 📱 Descrição do Aplicativo
O **Interclasse Digital** é um aplicativo mobile desenvolvido em React Native para a gestão de torneios desportivos escolares. Ele permite que os alunos visualizem as modalidades disponíveis, acompanhem a tabela de classificação em tempo real e consultem o calendário de jogos (com suporte offline).

Projeto desenvolvido para o Checkpoint de Desenvolvimento Mobile - 2º Semestre.

## 👥 Integrantes do Time
Gabriel Mediotti Marques - **RM 552632**
Jó Sales - **RM 552679**
Miguel Garcez de Carvalho - **RM 553768**
Vinicius Souza e Silva - **RM 552781**
Gustavo Bezerra Assumção - **RM 553076**

---

## 🚀 Tecnologias e Requisitos Atendidos
* **Interface e Estilização:** Utilização de `View`, `Text`, `TextInput`, `Pressable`, `FlatList` e `StyleSheet`.
* **Navegação:** Expo Router (File-based routing).
* **Integração com API (Axios):**
  * 1 API GET (`/classificacao` / `/modalidades`)
  * 2 APIs POST (`/login` / `/inscricao`)
* **Persistência de Dados (AsyncStorage):** Calendário de jogos salvo localmente para acesso offline.

---

## 📸 Evidências de Teste (APIs e App)

> **Nota:** As imagens abaixo comprovam o funcionamento dos endpoints isolados via Thunder Client/Postman e a interface do aplicativo.

### 1. Telas do Aplicativo
*(Coloque aqui as imagens/prints do app rodando no celular ou emulador)*
- `![Tela Inicial](./assets/evidencias/tela-inicial.png)`
- `![Tela de Inscrição](./assets/evidencias/tela-inscricao.png)`
- `![Calendário Offline](./assets/evidencias/tela-calendario.png)`

### 4. Como Testar

* **No Celular:** Abra o app **Expo Go** e escaneie o QR Code.
* **No PC:** Pressione `a` para Android ou `i` para iOS (se tiver emulador).

**Nota:** Esta é uma versão provisória para validação dos endpoints e da interface inicial.
