import * as React from "react";
import styles from "@/styles/Login.module.css";
import {
  Box,
  ButtonPrimary,
  ButtonSecondary,
  EmailField,
  IconUserAccountRegular,
  Inline,
  PasswordField,
  ResponsiveLayout,
  Stack,
  Text4,
  Text8,
  TextField,
  SuccessFeedback,
} from "@telefonica/mistica";
import { useRouter } from "next/router";
import { api } from "@/services/base";

export default function EditProfile() {
  const [nome, setNome] = React.useState("");
  const [nomeValid, setNomeValid] = React.useState(true);
  const [usuario, setUsuario] = React.useState("");
  const [usuarioValid, setUsuarioValid] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [senha, setSenha] = React.useState("");
  const [passValid, setPassValid] = React.useState(true);
  const [userId, setUserId] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const router = useRouter();

  const validateEmail = (text: string) => {
    return text.match(emailRegex);
  };

  React.useEffect(() => {
    setUserId(window.sessionStorage.getItem("userId") as string);
    if (userId) {
      handleGetUserInfo();
    }
  }, [userId]);

  const handleGetUserInfo = async () => {
    await api.get(`/get/user/${userId}`).then((res) => {
      setNome(res.data[0].nome);
      setUsuario(res.data[0].usuario);
      setEmail(res.data[0].email);
      setSenha(res.data[0].senha);
    });
  };

  const handleEditUser = async () => {
    if (
      !validateEmail(email) ||
      senha.length < 6 ||
      nome.length < 2 ||
      usuario.length < 2
    ) {
      setEmailValid(false);
      setPassValid(false);
      setNomeValid(false);
      setUsuarioValid(false);
      return;
    } else {
      try {
        await api.put(`/update/user/${userId}`, {
          nome,
          usuario: usuario,
          email,
          senha,
        });
        setShowSuccess(true);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <ResponsiveLayout className={styles.main}>
      {showSuccess ? (
        <SuccessFeedback
          title="Perfil atualizado com sucesso!"
          description="Seu perfil foi atualizado com sucesso."
          primaryButton={
            <ButtonPrimary onPress={() => router.replace("/home")}>
              Retornar Tela Inicial
            </ButtonPrimary>
          }
        />
      ) : (
        <Box className={styles.centerContent}>
          <Box paddingX={16}>
            <Stack space={8}>
              <Text8>Perfil</Text8>
            </Stack>
            <Box paddingTop={8}>
              <TextField
                label="Nome"
                name="nome-input"
                onChangeValue={setNome}
                value={nome}
                error={!nomeValid}
              />
            </Box>
            <Box paddingTop={24}>
              <TextField
                label="Nome de usuário"
                name="usuario-input"
                onChangeValue={setUsuario}
                value={usuario}
                error={!usuarioValid}
              />
            </Box>
            <Box paddingTop={24}>
              <EmailField
                label="E-mail"
                name="email-input"
                onChangeValue={setEmail}
                value={email}
                error={!emailValid}
              />
            </Box>
            <Box paddingTop={24}>
              <PasswordField
                label="Senha"
                name="senha-input"
                onChangeValue={setSenha}
                value={senha}
                error={!passValid}
              />
            </Box>
            <Box paddingTop={56}>
              <Inline space={16}>
                <ButtonSecondary onPress={router.back}>
                  Cancelar
                </ButtonSecondary>
                <ButtonPrimary onPress={() => handleEditUser()}>
                  Atualizar
                </ButtonPrimary>
              </Inline>
            </Box>
          </Box>
        </Box>
      )}
    </ResponsiveLayout>
  );
      }