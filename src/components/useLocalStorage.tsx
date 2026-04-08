// хук для синхронизированной связи
import {useState} from "react";

export const useLocalStorage =
    (key:string, firstValue:any) => {

     // значение
     const [value,setValue] = useState(() => {
           const saved = localStorage.getItem(key);
           return saved ? saved : firstValue;
     });

     // устанавливаем новый ключ
     const setStoredValue = (newValue:any) => {
            setValue(newValue);
            localStorage.setItem(key,newValue);
     };

     return [value,setStoredValue];
};

export default useLocalStorage;