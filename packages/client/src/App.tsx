import React, { useState, useRef } from 'react';
import { ChakraProvider, Container, Heading, VStack, Box, useColorModeValue } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import LinkList from './components/LinkList';
import { LinkForm } from './components/LinkForm';
import { TagManager } from './components/TagManager';

function App() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const linkListRef = useRef<{ fetchLinks: () => void }>(null);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const containerBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Box 
            minH="100vh" 
            bg={bgColor}
            py={8}
          >
            <Container maxW="container.xl">
              <Box
                bg={containerBg}
                borderRadius="xl"
                boxShadow="lg"
                borderWidth="1px"
                borderColor={borderColor}
                p={8}
              >
                <VStack spacing={8} align="stretch">
                  <Box textAlign="center" mb={4}>
                    <Heading 
                      size="xl" 
                      color="blue.600"
                      fontWeight="bold"
                      letterSpacing="tight"
                    >
                      Bookmark Manager
                    </Heading>
                    <Box 
                      mt={2} 
                      h="1px" 
                      w="100px" 
                      bg="blue.500" 
                      mx="auto"
                      opacity={0.5}
                    />
                  </Box>
                  <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <VStack spacing={8} align="stretch">
                            <LinkForm onSuccess={() => linkListRef.current?.fetchLinks()} />
                            <Box 
                              borderTopWidth="1px" 
                              borderColor={borderColor} 
                              pt={6}
                            >
                              <TagManager
                                selectedTags={selectedTags}
                                onChange={setSelectedTags}
                              />
                            </Box>
                            <Box 
                              borderTopWidth="1px" 
                              borderColor={borderColor} 
                              pt={6}
                            >
                              <LinkList ref={linkListRef} />
                            </Box>
                          </VStack>
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </VStack>
              </Box>
            </Container>
          </Box>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
