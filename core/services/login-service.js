import { AsyncStorage } from 'react-native';

class LoginService {
    async getUserAccount(){
        //Se consulta los datos locales del usuario
        var user = await AsyncStorage.getItem('User');
        if(user != null){
            user = JSON.parse(user);
        }

        return user;
    }

    async saveAccount(model){
        //Se guarda la informacion del usuario
        try {
            await AsyncStorage.setItem('User', JSON.stringify(model));
            return "OK";    
        } catch (error) {
            return "ERROR"
        }
    }

    async accessAcount(password){
        //Se extrae el usuario del localstorage
        var user = await AsyncStorage.getItem('User');
        if(user != null){
            user = JSON.parse(user);
        }
        //Se verifica si la contrasena es correcta o no 
        if(user != null){
            if(user.password == password){
                return true;
            }
        }
        
        return false;
    }
}

export default new LoginService();