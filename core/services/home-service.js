import { AsyncStorage } from 'react-native';

class HomeService{
    async getTasks(){
        //Se obtiene todas las tareas del localstorage
        var tasks = await AsyncStorage.getItem('Tasks');
        if(tasks != null){
            tasks = JSON.parse(tasks);
        }

        return tasks; 
    }

    async saveTasks(tasks){
        //Se guarda el listado de tareas
        try {
            await AsyncStorage.setItem('Tasks', JSON.stringify(tasks));
            return "OK";    
        } catch (error) {
            return "ERROR"
        }
    }

    async removeTask(index){
        //Se obtiene el listado de tareas del localstorage

        //Se elimina el 
    }
}

export default new HomeService();