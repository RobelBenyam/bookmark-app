import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  VStack,
  useToast,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Icon,
} from '@chakra-ui/react';
import { Link, linksApi } from '../services/api';
import { useState, useEffect } from 'react';
import { LinkIcon, ViewIcon, InfoIcon } from '@chakra-ui/icons';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: Link;
  onSuccess: () => void;
}

export function EditLinkModal({ isOpen, onClose, link, onSuccess }: EditLinkModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: link.url,
    title: link.title,
    description: link.description || '',
  });
  const toast = useToast();

  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.200', 'gray.600');
  const inputHoverBorderColor = useColorModeValue('gray.300', 'gray.500');
  const inputFocusBorderColor = useColorModeValue('blue.500', 'blue.300');
  const buttonBg = useColorModeValue('blue.500', 'blue.400');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.500');
  const buttonActiveBg = useColorModeValue('blue.700', 'blue.600');

  useEffect(() => {
    setFormData({
      url: link.url,
      title: link.title,
      description: link.description || '',
    });
  }, [link]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await linksApi.update(link.id, formData);
      toast({
        title: 'Link updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating link',
        description: 'Please try again later',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Edit Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>URL</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={LinkIcon} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    size="lg"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputHoverBorderColor }}
                    _focus={{ borderColor: inputFocusBorderColor }}
                    _focusVisible={{ boxShadow: 'none' }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={ViewIcon} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter title"
                    size="lg"
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputHoverBorderColor }}
                    _focus={{ borderColor: inputFocusBorderColor }}
                    _focusVisible={{ boxShadow: 'none' }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={InfoIcon} color="gray.400" />
                  </InputLeftElement>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter description (optional)"
                    size="lg"
                    rows={3}
                    bg={inputBg}
                    borderColor={inputBorderColor}
                    _hover={{ borderColor: inputHoverBorderColor }}
                    _focus={{ borderColor: inputFocusBorderColor }}
                    _focusVisible={{ boxShadow: 'none' }}
                    pl={12}
                  />
                </InputGroup>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
              bg={buttonBg}
              _hover={{ bg: buttonHoverBg }}
              _active={{ bg: buttonActiveBg }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
} 