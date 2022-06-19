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
   VStack,
} from "native-base";
import { TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Async from "@react-native-async-storage/async-storage";
import {
   addMonths,
   format,
   getMonth,
   intervalToDuration,
   subMonths,
} from "date-fns";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Lista } from "../../components/Lista";
import { Full } from "../../components/Full";

interface Props {
   data?: string;
   hora: string;
   image: string;
   mes?: number;
   total?: number;
}

interface PropsFull {
   entrada: Props;
   saida: Props;
   total?: number;
   data?: string;
}

const keyFull = "@keyFull";
const keyEmergencia = "@emergencia";
const keyExpediente = "@ponto";
const keyReserva = "@reserva";

export function Home() {
   const [date, setDate] = React.useState(new Date());
   const [selectdate, setSelectDate] = React.useState(new Date());
   const [dados, setDados] = React.useState<Props[]>([]);
   const [dadosFull, setDadosFull] = React.useState<PropsFull[]>([]);
   const [dadosEmer, setDadosEmer] = React.useState<PropsFull[]>([]);
   const [selectType, setSelectType] = React.useState("");
   const [categoria, setCategoria] = React.useState("expediente");

   const [saida, setSaida] = React.useState("");
   const [showModalType, setModalType] = React.useState(false);

   const [showModalCategoria, setModalCategoria] = React.useState(false);

   const [showModal, setShowModal] = React.useState(false);

   const handleCamera = React.useCallback(
      async (type: string) => {
         const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
         });

         if (!result.cancelled) {
            if (!result.cancelled) {
               const mes = date.getMonth() + 1;

               if (type === "expediente") {
                  try {
                     const data = await Async.getItem("@ponto");
                     const current: Props[] = data ? JSON.parse(data) : [];

                     const dados = {
                        data: format(new Date(), "dd"),
                        hora: format(new Date(), "HH:mm"),
                        mes,
                        image: result.uri,
                     };

                     const dataFormated = [...current, dados];

                     await Async.setItem(
                        "@ponto",
                        JSON.stringify(dataFormated)
                     );
                  } catch (error) {
                     console.log(error);
                  }
               }

               if (type === "full") {
                  try {
                     const dadosEntrada = {
                        hora: format(new Date(), "HH:mm"),
                        image: result.uri,
                        mes,
                     };

                     await Async.setItem(
                        keyReserva,
                        JSON.stringify([dadosEntrada])
                     );
                  } catch (error) {
                     console.log(error);
                  }
               }

               if (type === "emergencia") {
                  try {
                     const dadosEntrada = {
                        hora: format(new Date(), "HH:mm"),
                        image: result.uri,
                        mes,
                     };

                     await Async.setItem(
                        keyReserva,
                        JSON.stringify([dadosEntrada])
                     );

                     setModalCategoria(false);
                  } catch (error) {
                     console.log(error);
                  }
               }
               setShowModal(false);
               setModalCategoria(false);
               setModalType(false);
            }
         }
      },
      [date]
   );

   const handleLibrary = React.useCallback(
      async (type: string) => {
         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
         });

         if (!result.cancelled) {
            const mes = date.getMonth() + 1;

            if (type === "expediente") {
               try {
                  const data = await Async.getItem("@ponto");
                  const current: Props[] = data ? JSON.parse(data) : [];

                  const dados = {
                     data: format(new Date(), "dd"),
                     hora: format(new Date(), "HH:mm"),
                     mes,
                     image: result.uri,
                  };

                  const dataFormated = [...current, dados];

                  await Async.setItem("@ponto", JSON.stringify(dataFormated));
               } catch (error) {
                  console.log(error);
               }
            }

            if (type === "full") {
               try {
                  const dadosEntrada = {
                     hora: format(new Date(), "HH:mm"),
                     image: result.uri,
                     mes,
                  };

                  await Async.setItem(
                     keyReserva,
                     JSON.stringify([dadosEntrada])
                  );
               } catch (error) {
                  console.log(error);
               }
            }

            if (type === "emergencia") {
               try {
                  const dadosEntrada = {
                     hora: format(new Date(), "HH:mm"),
                     image: result.uri,
                     mes,
                  };

                  await Async.setItem(
                     keyReserva,
                     JSON.stringify([dadosEntrada])
                  );

                  setModalCategoria(false);
               } catch (error) {
                  console.log(error);
               }
            }
            setShowModal(false);
            setModalCategoria(false);
            setModalType(false);
         }
      },
      [date]
   );

   const handleSaida = React.useCallback(async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.cancelled) {
         const mes = date.getMonth() + 1;

         if (selectType === "full") {
            try {
               const reserva = await Async.getItem(keyReserva);
               const reservaEntrada: Props[] = reserva
                  ? JSON.parse(reserva)
                  : [];

               const data = await Async.getItem(keyFull);
               const current: Props[] = data ? JSON.parse(data) : [];

               const entrada = reservaEntrada.find((h) => h.mes === mes);

               const dados = {
                  entrada,
                  saida: {
                     mes,
                     image: result.uri,
                     hora: format(new Date(), "HH:mm"),
                  },
                  data: format(new Date(), "dd"),
               };

               const dataFormated = [...current, dados];

               await Async.setItem(keyFull, JSON.stringify(dataFormated));
            } catch (error) {
               console.log(error);
            }
         }

         if (selectType === "emergencia") {
            try {
               const reserva = await Async.getItem(keyReserva);
               const reservaEntrada: Props[] = reserva
                  ? JSON.parse(reserva)
                  : [];

               const data = await Async.getItem(keyEmergencia);
               const current: Props[] = data ? JSON.parse(data) : [];

               const entrada = reservaEntrada.find((h) => h.mes === mes);

               const dados = {
                  entrada,
                  saida: {
                     mes,
                     image: result.uri,
                     hora: format(new Date(), "HH:mm"),
                  },
                  data: format(new Date(), "dd"),
               };

               const dataFormated = [...current, dados];

               await Async.setItem(keyEmergencia, JSON.stringify(dataFormated));
            } catch (error) {
               console.log(error);
            }
         }

         setShowModal(false);
         setModalCategoria(false);
         setModalType(false);
      }
   }, [date, selectType]);

   const loadData = React.useCallback(async () => {
      const mes = selectdate.getMonth() + 1;
      console.log(mes);
      // await Async.removeItem(keyEmergencia);
      const dados = await Async.getItem("@ponto");
      const Expdiente: Props[] = dados ? JSON.parse(dados) : [];

      const dadosFull = await Async.getItem(keyFull);
      const full: PropsFull[] = dadosFull ? JSON.parse(dadosFull) : [];

      const dadosEmergencia = await Async.getItem(keyEmergencia);
      const emergencia: PropsFull[] = dadosEmergencia
         ? JSON.parse(dadosEmergencia)
         : [];

      const rs = Expdiente.map((h) => {
         const [hora, min] = h.hora.split(":").map(Number);
         const total = hora * 60 + min - (17 * 60 + 18);
         return {
            ...h,
            total,
         };
      }).filter((h) => h.mes === mes);

      const rsFull = full
         .map((h) => {
            const [horaE, minE] = h.entrada.hora.split(":").map(Number);
            const [horaS, minS] = h.saida.hora.split(":").map(Number);
            const totalE = horaE * 60 + minE;
            const totalS = horaS * 60 + minS;
            const duracao = intervalToDuration({
               start: new Date(2022, 6, 10, 0, totalE, 0),
               end: new Date(2022, 6, 10, 0, totalS, 0),
            });

            const total = duracao.hours! * 60 + duracao.minutes!;
            return {
               ...h,
               total,
            };
         })
         .filter((h) => h.entrada.mes === mes);

      const rsEmer = emergencia
         .map((h) => {
            const [horaE, minE] = h.entrada.hora.split(":").map(Number);
            const [horaS, minS] = h.saida.hora.split(":").map(Number);
            const totalE = horaE * 60 + minE;
            const totalS = horaS * 60 + minS;
            const duracao = intervalToDuration({
               start: new Date(2022, 6, 10, 0, totalE, 0),
               end: new Date(2022, 6, 10, 0, totalS, 0),
            });

            const total = duracao.hours! * 60 + duracao.minutes!;
            return {
               ...h,
               total,
            };
         })
         .filter((h) => h.entrada.mes === mes);

      setDados(rs);
      setDadosEmer(rsEmer);
      setDadosFull(rsFull);
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

   const totalHorasFull = React.useMemo(() => {
      return dadosFull.reduce((acc, item) => {
         return acc + item.total!;
      }, 0);
   }, [dadosFull]);

   const totalHorasEmer = React.useMemo(() => {
      return dadosEmer.reduce((acc, item) => {
         return acc + item.total!;
      }, 0);
   }, [dadosEmer]);

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
                     <Button onPress={() => handleLibrary(selectType)}>
                        biblioteca
                     </Button>
                  </HStack>
               </Center>
            </Box>
         </Modal>

         <Modal
            isOpen={showModalCategoria}
            onClose={() => setModalCategoria(false)}
         >
            <Center bg="dark.700" padding="5">
               <VStack space={10}>
                  <Box>
                     <Button
                        onPress={() => {
                           setSelectType("expediente");
                           setShowModal(true);
                           setModalCategoria(false);
                        }}
                     >
                        Apos o expediente
                     </Button>
                  </Box>

                  <Box>
                     <Button
                        onPress={() => {
                           setSelectType("full");
                           setModalType(true);
                           setModalCategoria(false);
                        }}
                     >
                        Feriado 100%
                     </Button>
                  </Box>

                  <Box>
                     <Button
                        onPress={() => {
                           setSelectType("emergencia");
                           setModalType(true);
                           setModalCategoria(false);
                        }}
                     >
                        Emergencia
                     </Button>
                  </Box>
               </VStack>
            </Center>
         </Modal>

         <Modal
            mt={20}
            isOpen={showModalType}
            onClose={() => setModalType(false)}
         >
            <Box bg="blue.700" padding="5">
               <Center>
                  <HStack space={8}>
                     <Button onPress={() => setShowModal(true)}>entrada</Button>
                     <Button onPress={handleSaida}>saida</Button>
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

         <HStack w="100%" justifyContent="space-between" mt={10}>
            <TouchableOpacity
               style={{ width: 100, height: 40 }}
               onPress={() => setCategoria("expediente")}
            >
               <Center
                  px="4"
                  py="1"
                  bg={categoria === "expediente" ? "dark.900" : "dark.500"}
                  borderRadius="10"
               >
                  <Text textAlign="center" fontSize="10">
                     APÓS O {"\n"} EXPEDIENTE
                  </Text>
               </Center>
            </TouchableOpacity>

            <TouchableOpacity
               style={{ width: 100, height: 40 }}
               onPress={() => setCategoria("full")}
            >
               <Center
                  px="4"
                  py="3"
                  h="100%"
                  borderRadius="10"
                  bg={categoria === "full" ? "dark.900" : "dark.500"}
               >
                  <Text fontSize="10">100%</Text>
               </Center>
            </TouchableOpacity>

            <TouchableOpacity
               style={{ width: 100, height: 40 }}
               onPress={() => setCategoria("emergencia")}
            >
               <Center
                  px="4"
                  py="1"
                  h="100%"
                  borderRadius="10"
                  bg={categoria === "emergencia" ? "dark.900" : "dark.500"}
               >
                  <Text textAlign="center" fontSize="10">
                     EMERGÊNCIA
                  </Text>
               </Center>
            </TouchableOpacity>
         </HStack>

         {categoria === "expediente" && (
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
         )}

         {categoria === "full" && (
            <Box padding={2} bg="dark.900" h="70%" mb="10" top={10}>
               <Text>TOTAL DE HORAS EXTRAS: {totalHorasFull} min</Text>
               <FlatList
                  data={dadosFull}
                  renderItem={({ item: h }) => (
                     <Full
                        data={h.data}
                        horaEntrada={h.entrada.hora}
                        imageEntrada={h.entrada.image}
                        horaSaida={h.saida.hora}
                        imageSaida={h.saida.image}
                        total={h.total}
                     />
                  )}
               />
            </Box>
         )}

         {categoria === "emergencia" && (
            <Box padding={2} bg="dark.900" h="70%" mb="10" top={10}>
               <Text>TOTAL DE HORAS EXTRAS: {totalHorasEmer} min</Text>
               <FlatList
                  data={dadosEmer}
                  renderItem={({ item: h }) => (
                     <Full
                        data={h.data}
                        horaEntrada={h.entrada.hora}
                        horaSaida={h.saida.hora}
                        imageEntrada={h.entrada.image}
                        imageSaida={h.saida.image}
                        total={h.total}
                     />
                  )}
               />
            </Box>
         )}
         <TouchableOpacity
            onPress={() => setModalCategoria(true)}
            style={{
               position: "absolute",
               width: 60,
               height: 60,
               borderRadius: 30,
               backgroundColor: "rgba(228, 99, 5, 0.7)",
               alignItems: "center",
               justifyContent: "center",

               top: "90%",
               right: 40,
            }}
         >
            <Text>ADD</Text>
         </TouchableOpacity>
      </Box>
   );
}
