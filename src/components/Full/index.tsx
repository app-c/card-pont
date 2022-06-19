/* eslint-disable react/require-default-props */
import React from "react";
import {
   Text,
   Box,
   VStack,
   HStack,
   Center,
   Image,
   ScrollView,
} from "native-base";

interface Props {
   data?: string;
   horaEntrada: string;
   horaSaida: string;
   imageEntrada: string;
   imageSaida: string;
   total?: number;
}

export function Full({
   data,
   horaEntrada,
   horaSaida,
   imageEntrada,
   imageSaida,
   total,
}: Props) {
   return (
      <Box borderRadius="10" mt={2} mb="10" flex="1">
         <VStack>
            <HStack space="2">
               <Center
                  borderRadius="30"
                  h="10"
                  w="10"
                  padding="2"
                  bg="primary.800"
               >
                  <Text color="dark.900">{data}</Text>
               </Center>

               <Center borderRadius={5} w="20" padding="2" bg="primary.700">
                  <Text color="dark.900">{horaEntrada}</Text>
               </Center>

               <Center borderRadius={5} w="20" padding="2" bg="primary.700">
                  <Text color="dark.900">{horaSaida}</Text>
               </Center>

               <Box borderRadius={5} w="40" padding="2" bg="success.600">
                  <Text color="dark.900">total: {total} min</Text>
               </Box>
            </HStack>

            <ScrollView
               _contentContainerStyle={{
                  p: "2",
               }}
               flex="1"
               horizontal
            >
               <Box w="100%">
                  <HStack>
                     <Image
                        w="400"
                        h="100"
                        resizeMode="cover"
                        alt="imageEntrada"
                        source={{ uri: imageEntrada }}
                     />
                     <Image
                        w="400"
                        h="100"
                        resizeMode="cover"
                        alt="imageSaida"
                        source={{ uri: imageSaida }}
                     />
                  </HStack>
               </Box>
            </ScrollView>
         </VStack>
      </Box>
   );
}
