// Esse inicio sao importacoes necessarias para o funcionamento do projeto
// a funcao useState eu usei para definir e atualizar os componentes
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Text, View, TextInput, FlatList, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native'; // responsavel por criar um container de telas
import { createStackNavigator } from '@react-navigation/stack'; // responsavel por criar o estilo de nevagacao no caso eh uma nevegacao por pilha (stack)
// HomeScreen eh a tela principal, sera a tela que ira redenrizar primeiro ao iniciar o app
// HomeScreen recebe uma proprieda navigation para navegar entre as telas
const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Bem Vindo</Text>

      {/* a prop navigation tem uma funcao chamada navigate que responsavel de chamar a outra tela, caso a tela de contatos */}
      {/* a tela contato eh chamada quando eu clico no botao pela prop onPress */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Contact')}>
        <Text style={styles.textButton}>Adicionar Contato</Text>
      </TouchableOpacity>
    </View>
  )
}


// ContactScreen eh a segunda tela para ser redenrizada
// Aqui esta a logica principal do aplicativo
const ContactScreen = () => {

  // aqui eu inicio todos os estados da aplicao (nome, numero de telefone, a lista de objetos e um id)
  // id sera usado para excluir exatamente o item da lista
  // se quiser aprender mais https://reactjs.org/docs/hooks-state.html
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [id, setId] = useState(0);
  const [schedule, setSchedule] = useState([])
  const [image, setImage] = useState(null)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  // essa funcao eh um evento quando eu clicar ira salvar na lista de objetos
  const handleButtonclick = () => {
    setId(id + 1) // significa que estou atualizando o estado do id = 0 para id = id + 1
    // a linha de baixo eh igual, estou salvando na lista objetos
    // agenda = [] ==> agenda = agenda + {id, nome, numero de telefone}
    setSchedule((currentState) => [...currentState, { id, name, phoneNumber, image }])
  }

  // funcao para excluir extamente o item aque for precionado
  const handleRemoveItem = (id) => {
    setSchedule(
      schedule.slice().filter((item) => item.id !== id)
    )
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  // funcao responsavel por renderizar cada item da lista
  // como tu pode ver, eu to passando uma prop do tipo item
  // esse item eh cada objeto da nossa lista de objetos {id, name, phoneNumber}
  const renderItem = ({ item }) => (
    // o item que sera redenrizado sera um botao
    // o botao com a prop onLongPress eh responsavel por chamar a funcao para remover o item da lista
    <TouchableOpacity style={styles.itemList} onLongPress={() => handleRemoveItem(item.id)}>
      <Text style={styles.textItem}>{item.name.toUpperCase()}</Text> {/* acessando a propriedade name e transaformando tudo em maiusculo*/}
      <Text style={styles.textItem}>{item.phoneNumber}</Text> {/* acessando a propriedade phoneNumber */}
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.h1}>Cadastro de contato</Text>

        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

        <TextInput
          style={styles.input}
          placeholder='Nome'
          onChangeText={text => setName(text)} // essa prop significa q cada letra que eu digito atualiza o estado name
          value={name}
        />

        <TextInput style={styles.input}
          placeholder='Telefone'
          keyboardType={'numeric'} // essa prop significa que quero apenas numeros no teclado
          onChangeText={text => setPhoneNumber(text)}
          value={phoneNumber}
        />

        <TouchableOpacity style={styles.button} onPress={handleButtonclick}>
          <Text style={styles.textButton}>Salvar</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={schedule} // Lista de objetos passado para prop data
        renderItem={renderItem} // o item aque sera redenrizado
        keyExtractor={(item) => item.id.toString()} // FlatList precisa de um identificador unico, por isso usei o ID
        style={{ width: '95%', marginVertical: 14 }} // prop de estilo
        showsVerticalScrollIndicator={false} // removando a scroll bar
      />
    </SafeAreaView>
  )
}

const ImagePickerExample = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

// createStackNavigator é uma função que retorna um objeto contendo 2 propriedades:
// Stack e Navigator. Ambos são componentes React usados ​​para configurar o navegador.
// O Navigator deve conter elementos de Tela como seus filhos para definir a configuração das rotas.
const Stack = createStackNavigator()
export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Contact" component={ContactScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  // significa que estou usando toda a tela
    alignItems: 'center', // alinhando os itens verticalmente
    justifyContent: 'center', // alinhando os itens horizontamente
  },
  form: {
    width: '100%', // largura
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%'
  },
  h1: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 6
  },
  input: {
    height: 40, // comprimento
    width: '95%',
    margin: 12,
    borderWidth: 1,
    borderRadius: 6, //arredondamento das pontas da borda
    padding: 8, // espacamento interno
    fontSize: 18
  },
  button: {
    height: 40,
    width: '95%',
    margin: 12, // espacamento externo
    backgroundColor: '#6200EE',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6
  },
  textButton: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white'
  },
  itemList: {
    width: '100%',
    padding: 16,
    marginTop: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'row', // mudando a direcao de coluna para linha
    justifyContent: 'space-around' // alinhando entre os espacos da caixa

  },
  textItem: {
    fontSize: 18,
    fontWeight: '600',
  }
});
