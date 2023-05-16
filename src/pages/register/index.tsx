import * as React from "react";
import styles from "@/styles/Login.module.css";
import {
  Box,
  ButtonDanger,
  Inline,
  ButtonSecondary,
  EmailField,
  PasswordField,
  ResponsiveLayout,
  Stack,
  Text8,
  TextField,
  ErrorFeedbackScreen,
  ButtonPrimary,
} from "@telefonica/mistica";
import { useRouter } from "next/router";
import { api } from "@/services/base";

export default function Register() {
  const [nome, setNome] = React.useState("");
  const [nomeValid, setNomeValid] = React.useState(true);
  const [usuario, setUsuario] = React.useState("");
  const [usuarioValid, setUsuarioValid] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [senha, setSenha] = React.useState("");
  const [passValid, setPassValid] = React.useState(true);
  const [showError, setShowError] = React.useState(false);
  const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const router = useRouter();

  const validateEmail = (text: string) => {
    return text.match(emailRegex);
  };

  const handleRegisterUser = async () => {
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
      setShowError(true);
      return;
    } else {
      try {
        await api.post("/create/user", {
          nome,
          email,
          usuario: usuario,
          senha,
        });
        router.push("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  if (showError) {
    return (
      <ErrorFeedbackScreen
        title="Erro no cadastro"
        description="Por favor, verifique se os dados estão corretos."
        primaryButton={
          <ButtonPrimary onPress={() => setShowError(false)}>
            Tentar novamente
          </ButtonPrimary>
        }
        link={
          <ButtonSecondary onPress={() => router.push("/")}>
            Ir para o Login
          </ButtonSecondary>
        }
        errorReference="Dados Informados Incorretamente"
      />
    );
  }

  return (
    <ResponsiveLayout className={styles.main}>
      <Box className={styles.centerContent}>
      <Box paddingX={16}>
        <Stack space={8}>
          <Text8>Cadastrar</Text8>
        </Stack>
        <Box paddingTop={8}>
          <TextField
            label='Nome'
            name='nome-input'
            onChangeValue={setNome}
            value={nome}
            error={!nomeValid}
          />
        </Box>
        <Box paddingTop={24}>
          <TextField
            label='Usuario'
            name='usuario-input'
            onChangeValue={setUsuario}
            value={usuario}
            error={!usuarioValid}
          />
        </Box>
        <Box paddingTop={24}>
          <EmailField
            label='Email'
            name='email-input'
            onChangeValue={setEmail}
            value={email}
            error={!emailValid}
            />
        </Box>
        <Box paddingTop={24}>
          <PasswordField
            label='Senha'
            name='senha-input'
            onChangeValue={setSenha}
            value={senha}
            error={!passValid}
          />
        </Box>
        <Box paddingTop={56}>
          <Inline space={16}>
            <ButtonDanger onPress={() => {handleRegisterUser()}}>
              Cadastrar
            </ButtonDanger>
            <ButtonSecondary onPress={() => { router.push("/") }}>
              Login
            </ButtonSecondary>
          </Inline>
        </Box>
        <Box paddingTop={32}>
        </Box>
      </Box>
      </Box>
    </ResponsiveLayout>
  )
}
