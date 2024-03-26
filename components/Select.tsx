import { View, Text, TextInput, Pressable, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import { styles } from '../utils/commonStyles'
import { Colours } from '../utils/Colours'
import {FontAwesome} from '@expo/vector-icons';

type sessionsProp={
    data:{id:number, title:string, ongoing:boolean, withinRange:boolean}[] | undefined
}
const Select = ({data}:sessionsProp) => {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(data ? data[0].title:'');
    const selectClass = (e:string)=>{
        setSelectedItem(e);
        setOpen(false);
    }

    // console.log('data: ', data)
  return (
    <View style={{width:'100%', justifyContent:'center', alignItems:'center'}} >
      <TouchableOpacity onPress={()=>setOpen(e=>!e)}  style={{flexDirection:'row'}} >
        <Text style={[styles.input, open && {borderBottomLeftRadius:0, borderBottomRightRadius:0, borderBottomWidth:0} ]}>{selectedItem}</Text>
        <Pressable onPress={()=>setOpen(e=>!e)} style={{position:'absolute', right:5, alignSelf:'center', alignItems:'center', justifyContent:'center'}} >
            <FontAwesome name={open? "chevron-up" : "chevron-down"} size={12} color='black' />
        </Pressable>
      </TouchableOpacity>
      {
        data && data.length > 0 && open &&
        <View style={{
            width:'100%', 
            alignItems:'flex-start', 
            flexDirection:'column', 
            borderColor:Colours.primary, 
            borderWidth:1,
            paddingVertical:3, paddingHorizontal:8, borderRadius:4, borderTopWidth:0, borderTopRightRadius:0,
            borderTopLeftRadius:0,
            }} >
            {
                data && data.map(item=>(
                    <TouchableOpacity onPress={()=>selectClass(item.title)} key={item.id} style={{width:'100%'}} >
                        <Text style={{fontSize:18, color:Colours.input}} >{item.title}</Text>
                    </TouchableOpacity>
                ))
            }
        </View>
      }
    </View>
  )
}

export default Select