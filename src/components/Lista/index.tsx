/* eslint-disable react/require-default-props */
import React from "react";
import { Text, Box, VStack, HStack, Center, Image } from "native-base";

interface Props {
   data: string;
   hora: string;
   image: string;
   total?: number;
}

export function Lista({ data, hora, image, total }: Props) {
   return (
      <Box mt={2} mb="10" flex="1">
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
                  <Text color="dark.900">17:18</Text>
               </Center>

               <Center borderRadius={5} w="20" padding="2" bg="primary.700">
                  <Text color="dark.900">{hora}</Text>
               </Center>

               <Box borderRadius={5} w="40" padding="2" bg="success.600">
                  <Text color="dark.900">total: {total} min</Text>
               </Box>
            </HStack>

            <Box mt="2" h="20" bg="dark.600" w="100%">
               <Image
                  size="100"
                  w="100%"
                  resizeMode="cover"
                  alt={image}
                  source={{ uri: image }}
               />
            </Box>
         </VStack>
      </Box>
   );
}
