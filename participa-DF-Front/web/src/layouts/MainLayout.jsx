import React, { useState } from 'react';
import { 
  AppShell, Group, Text, Button, Container, 
  ActionIcon, Paper, ScrollArea, TextInput, 
  Box, Transition, Divider, Badge
} from '@mantine/core';
import { Outlet, useNavigate } from 'react-router-dom';

export default function MainLayout() {
  const navigate = useNavigate();
  
  // Estado para controlar se o chat está aberto ou fechado
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <AppShell header={{ height: 70 }} padding="md">
      
      {/* --- HEADER (CÓDIGO ORIGINAL SEU) --- */}
      <AppShell.Header bg="#0056b3">
        <Container
          size="xl"
          h="100%"
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Text
            size="xl"
            fw={700}
            c="white"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Participa DF
          </Text>

          <div style={{ flex: 1 }} />

          <Group h="100%" gap={0}>
            <Button
              variant="subtle"
              c="white"
              h="100%"
              styles={{
                root: { borderRadius: 0, paddingLeft: 20, paddingRight: 20 },
                rootHovered: { backgroundColor: 'rgba(255,255,255,0.15)' },
              }}
              onClick={() => navigate('/')}
            >
              Início
            </Button>

            <Button
              variant="subtle"
              c="white"
              h="100%"
              styles={{
                root: { borderRadius: 0, paddingLeft: 20, paddingRight: 20 },
                rootHovered: { backgroundColor: 'rgba(255,255,255,0.15)' },
              }}
              onClick={() => navigate('/efetuar-login')}
            >
              Entrar
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>

      {/* --- CÓDIGO DO AGENTE DE IA (CHATBOT) --- */}
      
      {/* 1. JANELA DO CHAT (Abre com animação) */}
      <Transition mounted={chatOpen} transition="slide-up" duration={300} timingFunction="ease">
        {(styles) => (
          <Paper
            shadow="xl"
            radius="md"
            withBorder
            style={{
              ...styles,
              position: 'fixed',
              bottom: 90, // Fica um pouco acima do botão
              right: 20,
              width: 320,
              height: 450,
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              backgroundColor: 'white'
            }}
          >
            {/* Cabeçalho do Chat */}
            <Box p="md" bg="#0056b3" style={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Group spacing="xs">
                <Text size="lg">🤖</Text>
                <Box>
                    <Text size="sm" weight={700}>Assistente Virtual</Text>
                    <Badge size="xs" color="green" variant="filled">Online</Badge>
                </Box>
              </Group>
              <ActionIcon variant="transparent" color="white" onClick={() => setChatOpen(false)}>
                ✕
              </ActionIcon>
            </Box>

            {/* Corpo do Chat (Área de rolagem) */}
            <ScrollArea style={{ flex: 1, padding: 15 }} bg="#f8f9fa">
              
              {/* Mensagem do Robô */}
              <Box mb="md" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                 <Paper p="xs" radius="md" bg="white" shadow="xs" withBorder style={{ maxWidth: '85%' }}>
                    <Text size="sm">Olá! Sou a IZA do Participa DF. Como posso te ajudar hoje?</Text>
                 </Paper>
              </Box>

              {/* Opções de Dúvidas (PLACEHOLDERS) */}
              <Text size="xs" color="dimmed" mb="xs" align="center">Selecione uma opção:</Text>
              
              <Group direction="column" spacing="xs">
                  <Button variant="outline" size="xs" fullWidth color="blue" styles={{ inner: { justifyContent: 'flex-start' } }}>
                    ❓ Como fazer uma denúncia?
                  </Button>
                  <Button variant="outline" size="xs" fullWidth color="blue" styles={{ inner: { justifyContent: 'flex-start' } }}>
                    🔍 Consultar andamento
                  </Button>
                  <Button variant="outline" size="xs" fullWidth color="blue" styles={{ inner: { justifyContent: 'flex-start' } }}>
                    🔒 O sigilo é garantido?
                  </Button>
                  <Button variant="outline" size="xs" fullWidth color="blue" styles={{ inner: { justifyContent: 'flex-start' } }}>
                    📞 Telefones úteis
                  </Button>
              </Group>

              {/* OBSERVAÇÃO PARA OS DESENVOLVEDORES DA CONSULTORIA:
                 Aqui vocês podem injetar o histórico de mensagens da API de vocês.
                 Basta substituir esses componentes fixos por um .map() no estado das mensagens.
              */}

            </ScrollArea>

            {/* Rodapé (Input) */}
            <Box p="xs" style={{ borderTop: '1px solid #eee' }}>
               <TextInput 
                  placeholder="Digite sua dúvida..."
                  rightSection={
                    <ActionIcon color="blue" variant="filled" size="sm">
                      ➤
                    </ActionIcon>
                  }
               />
            </Box>

          </Paper>
        )}
      </Transition>

      {/* 2. BOTÃO FLUTUANTE (FAB) */}
      <div
        style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
        }}
      >
        {chatOpen ? (
             // Botão de fechar (X) quando aberto
             <ActionIcon 
                color="red" 
                size={60} 
                radius="xl" 
                variant="filled" 
                shadow="xl"
                onClick={() => setChatOpen(false)}
             >
                <Text size={30}>✕</Text>
             </ActionIcon>
        ) : (
             // Botão do Robô quando fechado
             <Button
                color="blue"
                radius="xl"
                size="xl"
                h={60}
                w={60}
                p={0}
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
                onClick={() => setChatOpen(true)}
             >
                <Text size={35}>🤖</Text>
             </Button>
        )}
      </div>

    </AppShell>
  );
}