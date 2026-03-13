import axios from "axios";

// DESCOMENTE A LINHA CORRETA PARA O SEU AMBIENTE DE TESTE ATUAL:

// 1. Para Web ou Simulador iOS:
const IP_REDE_LOCAL = "http://localhost:8081";

// 2. Para Emulador Android Studio:
// const IP_REDE_LOCAL = "http://10.0.2.2:8081";

// 3. Para Celular Físico (Coloque o seu IP do 'ipconfig'):
// const IP_REDE_LOCAL = "http://192.168.1.XX:8081"; 


export const api = axios.create({
  baseURL: IP_REDE_LOCAL, 
  timeout: 5000,          
});