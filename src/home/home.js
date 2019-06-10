import React, { Component } from 'react'
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import LoginService from '../../core/services/login-service'
import HomeService from '../../core/services/home-service'
import Empty from './empty'
import Separator from './separator';

class Home extends Component {
    renderEmtpy = () => <Empty text="No hay tareas" />
    itemSeparator = () => <Separator />

    constructor(){
        super();
        this.state = {
            modalVisible: false,
            username: "",
            newTask: "",
            tasks: [],
            extraTasks: []
        }
    }
    componentDidMount(){
        this.getCurrentUser();
        this.getTasks();
    }
    getCurrentUser(){
        LoginService.getUserAccount().then((response) => {
            this.setState({
                username: response.username
            });
        });
    }
    getTasks(){
        HomeService.getTasks().then((response) => {
            if(response !== null){
                this.setState({
                    tasks: response
                });
            }
        });
    }
    createTask(){
        if(this.state.newTask == ''){
            Alert.alert("Advertencia", "Debes ingresar una tarea");
            return;
        }

        //Se valida si existe la tarea en el listado
        console.log(this.state.tasks);
        var result = this.state.tasks.filter(item => item.task === this.state.newTask.toLowerCase());
        if(result.length>0){
            Alert.alert("Advertencia", "Ya ingresaste esta tarea");
            return;
        }

        //Se agrega la tarea
        this.state.tasks.push({task: this.state.newTask});
        var newTasks = this.state.tasks;
        HomeService.saveTasks(newTasks).then((response) => {
            if(response === "OK"){
                this.setState({ newTask: ""});
                this.getTasks();
            }else{
                Alert.alert("Advertencia", "No se pudo ingresar tu tarea");
            }
        });
    }
    deleteItemById(task){
        //Se filtra el listado antes de ser guardado
        var filteredTasks = this.state.tasks.filter(item => item.task !== task);
        console.log(filteredTasks);
        //Se llama al servicio para actualizar el listado en el localstorage
        HomeService.saveTasks(filteredTasks).then((response) => {
            if(response === "OK"){
                this.getTasks();
            }else{
                Alert.alert("Advertencia", "No se pudo eliminar tu tarea");
            }
        });
        

    }
    render(){
        return (
            <View style={styles.container}>
                <Text style={styles.header_title}>Hola {this.state.username}</Text>
                <View>
                    <Text style={styles.new_task_title}>Agrega una nueva tarea</Text>
                    <View style={styles.input_section}>
                        <TextInput value={this.state.newTask} style={styles.form_input} onChangeText={(text) => this.setState({ newTask: text }) }></TextInput>
                        <Button title="Agregar" onPress={() => {this.createTask()}}></Button>
                    </View>
                    <Text style={styles.header_subtitle}>Tareas</Text>
                    <Separator/>
                </View>
                
                <FlatList
                    data={this.state.tasks}
                    extraData={this.state.extraTasks}
                    keyExtractor={(item) => item.task}
                    ListEmptyComponent={this.renderEmtpy}
                    ItemSeparatorComponent={this.itemSeparator}
                    renderItem = { ({item}) => (
                        <View style={styles.row}>
                            <Text style={styles.task_title}>{item.task}</Text>
                            <Button style={styles.task_btn} title="Eliminar" onPress={() => this.deleteItemById(item.task)}></Button>
                        </View>
                    )}>
                </FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1
    },
    header_title:{
        fontWeight: '600',
        fontSize: 26,
        marginBottom: 8,
        color: '#0a3d62'
    },
    header_subtitle: {
        fontSize:20,
        color: '#3c6382',
        paddingBottom: 2 
    },
    new_task_title: {
        fontSize: 16,
        marginTop: 8
    },
    input_section: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        marginTop: 6
    },
    task_title: {
        flex: 1,
        fontSize: 18,
        paddingHorizontal: 4 
    },
    task_btn: {
        
    },
    form_input: {
        flex: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 4,
        fontSize: 16,
        marginRight: 4,
        color: '#596275'
    }
});

export default Home;