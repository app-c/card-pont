/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { useCallback } from "react";
import {
   Text,
   Box,
   Center,
   HStack,
   FlatList,
   Button,
   Icon,
   Modal,
} from "native-base";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Async from "@react-native-async-storage/async-storage";
import { addMonths, format, getMonth, subMonths } from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Lista } from "../../components/Lista";

interface Props {
   data: string;
   hora: string;
   image: string;
   mes: number;
   total?: number;
}

export function Home() {
   const [date, setDate] = React.useState(new Date());
   const [selectdate, setSelectDate] = React.useState(new Date());
   const [dados, setDados] = React.useState<Props[]>([]);

   const [showModal, setShowModal] = React.useState(false);

   const handleCamera = React.useCallback(async () => {
      const result = await ImagePicker.launchCameraAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.cancelled) {
         const mes = date.getMonth() + 1;

         const dados = {
            data: format(date, "dd"),
            hora: format(date, "HH:mm"),
            mes,
            image: result.uri,
         };

         try {
            const data = await Async.getItem("@ponto");
            const current = data ? JSON.parse(data) : [];

            const dataFormated = [...current, dados];

            await Async.setItem("@ponto", JSON.stringify(dataFormated));
         } catch (error) {
            console.log(error);
         }
      }
   }, [date]);

   const handleLibrary = React.useCallback(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.cancelled) {
         const mes = date.getMonth() + 1;

         const dados = {
            data: format(date, "dd"),
            hora: format(date, "HH:mm"),
            mes,
            image: result.uri,
         };

         try {
            const data = await Async.getItem("@ponto");
            const current = data ? JSON.parse(data) : [];

            const dataFormated = [...current, dados];

            await Async.setItem("@ponto", JSON.stringify(dataFormated));
         } catch (error) {
            console.log(error);
         }
      }
   }, [date]);

   const loadData = React.useCallback(async () => {
      const dados = await Async.getItem("@ponto");
      const response = dados ? JSON.parse(dados) : [];

      const rs = response
         .filter((h) => {
            const month = getMonth(selectdate) + 1;
            if (h.mes === month) {
               return h;
            }
         })
         .map((h) => {
            const [hora, min] = h.hora.split(":").map(Number);
            const total = (hora - 17) * 60 + (min + 18);

            return {
               ...h,
               total,
            };
         });

      setDados(rs);
   }, [selectdate]);

   useFocusEffect(
      useCallback(() => {
         loadData();
      }, [loadData])
   );

   const totalHoras = React.useMemo(() => {
      return dados.reduce((acc, item) => {
         return acc + item.total!;
      }, 0);
   }, [dados]);

   const handleChangeMonth = React.useCallback(
      (action: "prev" | "next") => {
         if (action === "prev") {
            setSelectDate(subMonths(selectdate, 1));
         } else {
            setSelectDate(addMonths(selectdate, 1));
         }
      },
      [selectdate]
   );

   return (
      <Box padding={5} w="100%" flex="1" bg="primary.900">
         <Modal mt={20} isOpen={showModal} onClose={() => setShowModal(false)}>
            <Box bg="blue.700" padding="5">
               <Center>
                  <HStack space={8}>
                     <Button onPress={handleCamera}>camera</Button>
                     <Button onPress={handleLibrary}>biblioteca</Button>
                  </HStack>
               </Center>
            </Box>
         </Modal>
         <Center mb={10}>
            <Text color="dark.900">MEUS PONTOS</Text>
         </Center>
         <Center>
            <HStack space={10}>
               <TouchableOpacity onPress={() => handleChangeMonth("prev")}>
                  <Center padding="2" borderRadius="5" w="20" bg="primary.500">
                     <AntDesign name="leftcircle" size={30} />
                  </Center>
               </TouchableOpacity>

               <Center>
                  <Text color="dark.900" fontSize="2xl">
                     {format(selectdate, "MMMM/yy")}
                  </Text>
               </Center>

               <TouchableOpacity onPress={() => handleChangeMonth("next")}>
                  <Center padding="2" borderRadius="5" w="20" bg="primary.500">
                     <AntDesign name="rightcircle" size={30} />
                  </Center>
               </TouchableOpacity>
            </HStack>
         </Center>

         <Box padding={2} bg="dark.900" h="70%" mb="10" top={10}>
            <Text>TOTAL DE HORAS EXTRAS: {totalHoras} min</Text>
            <FlatList
               data={dados}
               renderItem={({ item: h }) => (
                  <Lista
                     data={h.data}
                     hora={h.hora}
                     image={h.image}
                     total={h.total}
                  />
               )}
            />
         </Box>
         <Button mt={5} onPress={() => setShowModal(true)}>
            ADICIONAR
         </Button>
      </Box>
   );
}
