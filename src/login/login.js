import React, { Component } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert, AppState } from 'react-native';
import LoginService from '../../core/services/login-service'
import Home from '../home/home'

class Login extends Component {
    constructor(){
        super();
        this.state = {
            username: "",
            currentuser: "",
            password: "",
            isAuthenticated: false
        }
    }
    componentDidMount(){
        this.getCurrentUser();
    }
    getCurrentUser(){
        LoginService.getUserAccount().then((data) => {
            this.setState({ username: data.username });
        })
    }
    saveAccount(){
        if(this.state.currentuser == ''){
            Alert.alert("Advertencia","Debe ingresar un usuario");
            return;
        }
        if(this.state.password == ''){
            Alert.alert("Advertencia","Debe ingresar una contraseña");
            return;
        }

        LoginService.saveAccount({ username: this.state.currentuser, password: this.state.password }).then((response) => {
            if(response == "OK"){
                //Se cambia la vista a home
                this.setState({isAuthenticated: true});
            }else{
                Alert.alert("Advertencia", "No se pudo registrar sus datos");
            }
        });
    }
    verifyAccount(){
        if(this.state.password == ''){
            Alert.alert("Advertencia","Debe ingresar una contraseña");
            return;
        }

        LoginService.accessAcount(this.state.password).then((response) => {
            if(response){
                //Se cambia la vista a home
                this.setState({isAuthenticated: true});
            }else{
                Alert.alert("Advertencia", "Contraseña incorrecta");
            }
        })
    }
    render(){
        return (
            <View style={styles.container}>
                {this.state.isAuthenticated ? <Home></Home> : 
                    <View style={styles.sub_container}>
                        {this.state.username == '' ? 
                            <View style={styles.row}>
                                <Text style={styles.title}>Nombres</Text>
                                <TextInput style={styles.form_input} 
                                onChangeText={(text) => this.setState({ currentuser: text }) }></TextInput>
                            </View>
                            : null }
                        <View style={styles.row}>
                            <Text style={styles.title}>Contraseña</Text>
                            <TextInput secureTextEntry style={styles.form_input}
                            onChangeText={(text) => this.setState({ password: text }) }></TextInput>
                        </View>
                        <View style={styles.row}>
                            {this.state.username == '' ?
                                <Button style={styles.btn} title="Guardar" onPress={() => this.saveAccount()}></Button>
                                : 
                                <Button style={styles.btn} title="Acceder" onPress={() => this.verifyAccount()}></Button>
                            }
                        </View>
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    sub_container: {
        padding: 20,
        flex: 1,
        justifyContent: 'center'
    },
    row: {

    },
    title: {
        fontSize:16,
        color: '#393939'
    },
    form_input: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        marginVertical: 6,
        fontSize: 16,
        color: '#596275'
    },
    btn: {
        backgroundColor: '#0d75a5',
        color: 'white'
    }
});

export default Login;